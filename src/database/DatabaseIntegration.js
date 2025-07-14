/**
 * Enterprise Database Integration System - Phase 2
 * Multi-Provider Database Support with API Generation and Real-time Features
 *
 * Supported Databases:
 * - PostgreSQL, MySQL, MongoDB
 * - AWS RDS, Azure SQL, GCP Cloud SQL
 * - DynamoDB, CosmosDB, Firestore
 *
 * Features:
 * - Unified database interface
 * - API generation (REST & GraphQL)
 * - Real-time capabilities
 * - Connection pooling
 * - Schema management
 * - Migration system
 */

import { Pool as PostgresPool } from "pg";
import mysql from "mysql2/promise";
import { MongoClient } from "mongodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CosmosClient } from "@azure/cosmos";
import { initializeApp, getFirestore } from "firebase/firestore";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { PubSub } from "graphql-subscriptions";
import chalk from "chalk";

export class DatabaseIntegration {
  constructor(options = {}) {
    this.config = {
      // Database Configuration
      defaultProvider: options.defaultProvider || "postgresql",
      connectionTimeout: options.connectionTimeout || 30000,
      maxConnections: options.maxConnections || 100,
      idleTimeout: options.idleTimeout || 30000,

      // API Configuration
      enableRESTAPI: options.enableRESTAPI !== false,
      enableGraphQL: options.enableGraphQL !== false,
      enableRealtime: options.enableRealtime !== false,

      // Security Configuration
      enableSSL: options.enableSSL !== false,
      enableEncryption: options.enableEncryption !== false,

      // Performance Configuration
      enableCaching: options.enableCaching !== false,
      cacheTimeout: options.cacheTimeout || 300000, // 5 minutes

      ...options,
    };

    // Database connections
    this.connections = new Map();
    this.schemas = new Map();
    this.queryBuilders = new Map();

    // Real-time features
    this.pubsub = new PubSub();
    this.socketServer = null;
    this.subscribers = new Map();

    // API generators
    this.restRoutes = new Map();
    this.graphqlResolvers = new Map();

    // Cache
    this.cache = new Map();
    this.cacheTimers = new Map();

    // Migration system
    this.migrations = [];
    this.migrationHistory = new Set();

    console.log(chalk.blue("🗄️  Database Integration System initialized"));
  }

  /**
   * Initialize database connections
   */
  async initialize() {
    try {
      await this.loadConfiguration();
      await this.establishConnections();
      await this.runMigrations();

      if (this.config.enableRealtime) {
        await this.setupRealtimeFeatures();
      }

      console.log(chalk.green("✅ Database system ready"));
      return true;
    } catch (error) {
      console.error(chalk.red("❌ Database initialization failed:"), error);
      throw error;
    }
  }

  /**
   * Load database configuration from environment
   */
  async loadConfiguration() {
    this.dbConfigs = {
      postgresql: {
        host: process.env.PG_HOST || "localhost",
        port: parseInt(process.env.PG_PORT || "5432"),
        database: process.env.PG_DATABASE || "pwa_app",
        user: process.env.PG_USER || "postgres",
        password: process.env.PG_PASSWORD || "password",
        ssl: this.config.enableSSL ? { rejectUnauthorized: false } : false,
        max: this.config.maxConnections,
        idleTimeoutMillis: this.config.idleTimeout,
        connectionTimeoutMillis: this.config.connectionTimeout,
      },

      mysql: {
        host: process.env.MYSQL_HOST || "localhost",
        port: parseInt(process.env.MYSQL_PORT || "3306"),
        database: process.env.MYSQL_DATABASE || "pwa_app",
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "password",
        ssl: this.config.enableSSL ? {} : false,
        connectionLimit: this.config.maxConnections,
        acquireTimeout: this.config.connectionTimeout,
        timeout: this.config.idleTimeout,
      },

      mongodb: {
        url: process.env.MONGO_URL || "mongodb://localhost:27017/pwa_app",
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          maxPoolSize: this.config.maxConnections,
          serverSelectionTimeoutMS: this.config.connectionTimeout,
          socketTimeoutMS: this.config.idleTimeout,
        },
      },

      dynamodb: {
        region: process.env.AWS_REGION || "us-east-1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        endpoint: process.env.DYNAMODB_ENDPOINT,
      },

      cosmosdb: {
        endpoint: process.env.COSMOS_ENDPOINT,
        key: process.env.COSMOS_KEY,
        databaseId: process.env.COSMOS_DATABASE || "pwa_app",
        containerId: process.env.COSMOS_CONTAINER || "items",
      },

      firestore: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        keyFilename: process.env.FIREBASE_KEY_FILE,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      },
    };
  }

  /**
   * Establish database connections
   */
  async establishConnections() {
    const providers = Object.keys(this.dbConfigs);

    for (const provider of providers) {
      try {
        const connection = await this.createConnection(provider);
        if (connection) {
          this.connections.set(provider, connection);
          this.queryBuilders.set(provider, this.createQueryBuilder(provider));
          console.log(chalk.green(`✅ Connected to ${provider}`));
        }
      } catch (error) {
        console.warn(
          chalk.yellow(`⚠️  Failed to connect to ${provider}:`, error.message),
        );
      }
    }

    if (this.connections.size === 0) {
      throw new Error("No database connections established");
    }
  }

  /**
   * Create database connection based on provider
   */
  async createConnection(provider) {
    const config = this.dbConfigs[provider];

    switch (provider) {
      case "postgresql":
        const pgPool = new PostgresPool(config);
        await pgPool.query("SELECT NOW()"); // Test connection
        return pgPool;

      case "mysql":
        const mysqlPool = mysql.createPool(config);
        await mysqlPool.execute("SELECT 1"); // Test connection
        return mysqlPool;

      case "mongodb":
        const mongoClient = new MongoClient(config.url, config.options);
        await mongoClient.connect();
        return mongoClient.db();

      case "dynamodb":
        if (!config.accessKeyId || !config.secretAccessKey) return null;
        return new DynamoDBClient({
          region: config.region,
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
          ...(config.endpoint && { endpoint: config.endpoint }),
        });

      case "cosmosdb":
        if (!config.endpoint || !config.key) return null;
        const cosmosClient = new CosmosClient({
          endpoint: config.endpoint,
          key: config.key,
        });
        const { database } = await cosmosClient.databases.createIfNotExists({
          id: config.databaseId,
        });
        return database;

      case "firestore":
        if (!config.projectId) return null;
        const app = initializeApp({
          projectId: config.projectId,
          ...(config.keyFilename && { credential: config.keyFilename }),
        });
        return getFirestore(app);

      default:
        throw new Error(`Unsupported database provider: ${provider}`);
    }
  }

  /**
   * Create query builder for provider
   */
  createQueryBuilder(provider) {
    return new QueryBuilder(provider, this.connections.get(provider));
  }

  /**
   * Execute query with caching
   */
  async query(provider, queryOrOperation, params = [], options = {}) {
    const cacheKey = options.cache
      ? `${provider}:${JSON.stringify({ queryOrOperation, params })}`
      : null;

    // Check cache
    if (cacheKey && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const connection = this.connections.get(provider);
      if (!connection) {
        throw new Error(`No connection for provider: ${provider}`);
      }

      let result;

      switch (provider) {
        case "postgresql":
        case "mysql":
          result = await connection.query(queryOrOperation, params);
          break;

        case "mongodb":
          result = await this.executeMongoOperation(
            connection,
            queryOrOperation,
            params,
          );
          break;

        case "dynamodb":
          result = await this.executeDynamoOperation(
            connection,
            queryOrOperation,
            params,
          );
          break;

        case "cosmosdb":
          result = await this.executeCosmosOperation(
            connection,
            queryOrOperation,
            params,
          );
          break;

        case "firestore":
          result = await this.executeFirestoreOperation(
            connection,
            queryOrOperation,
            params,
          );
          break;

        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      // Cache result
      if (cacheKey && options.cache) {
        this.cache.set(cacheKey, result);
        this.cacheTimers.set(
          cacheKey,
          setTimeout(() => {
            this.cache.delete(cacheKey);
            this.cacheTimers.delete(cacheKey);
          }, this.config.cacheTimeout),
        );
      }

      return result;
    } catch (error) {
      console.error(chalk.red(`Database query failed (${provider}):`), error);
      throw error;
    }
  }

  /**
   * Execute MongoDB operations
   */
  async executeMongoOperation(db, operation, params) {
    const { collection, action, query, data, options } = operation;
    const coll = db.collection(collection);

    switch (action) {
      case "find":
        return await coll.find(query, options).toArray();
      case "findOne":
        return await coll.findOne(query, options);
      case "insertOne":
        return await coll.insertOne(data, options);
      case "insertMany":
        return await coll.insertMany(data, options);
      case "updateOne":
        return await coll.updateOne(query, data, options);
      case "updateMany":
        return await coll.updateMany(query, data, options);
      case "deleteOne":
        return await coll.deleteOne(query, options);
      case "deleteMany":
        return await coll.deleteMany(query, options);
      case "aggregate":
        return await coll.aggregate(query, options).toArray();
      default:
        throw new Error(`Unsupported MongoDB action: ${action}`);
    }
  }

  /**
   * Execute DynamoDB operations
   */
  async executeDynamoOperation(client, operation, params) {
    const {
      GetItemCommand,
      PutItemCommand,
      UpdateItemCommand,
      DeleteItemCommand,
      ScanCommand,
      QueryCommand,
    } = await import("@aws-sdk/client-dynamodb");

    const { action, tableName, ...commandParams } = operation;

    switch (action) {
      case "getItem":
        return await client.send(
          new GetItemCommand({ TableName: tableName, ...commandParams }),
        );
      case "putItem":
        return await client.send(
          new PutItemCommand({ TableName: tableName, ...commandParams }),
        );
      case "updateItem":
        return await client.send(
          new UpdateItemCommand({ TableName: tableName, ...commandParams }),
        );
      case "deleteItem":
        return await client.send(
          new DeleteItemCommand({ TableName: tableName, ...commandParams }),
        );
      case "scan":
        return await client.send(
          new ScanCommand({ TableName: tableName, ...commandParams }),
        );
      case "query":
        return await client.send(
          new QueryCommand({ TableName: tableName, ...commandParams }),
        );
      default:
        throw new Error(`Unsupported DynamoDB action: ${action}`);
    }
  }

  /**
   * Execute Cosmos DB operations
   */
  async executeCosmosOperation(database, operation, params) {
    const { action, containerId, ...operationParams } = operation;
    const container = database.container(containerId);

    switch (action) {
      case "create":
        return await container.items.create(operationParams.item);
      case "read":
        return await container
          .item(operationParams.id, operationParams.partitionKey)
          .read();
      case "replace":
        return await container
          .item(operationParams.id, operationParams.partitionKey)
          .replace(operationParams.item);
      case "delete":
        return await container
          .item(operationParams.id, operationParams.partitionKey)
          .delete();
      case "query":
        return await container.items.query(operationParams.query).fetchAll();
      default:
        throw new Error(`Unsupported Cosmos DB action: ${action}`);
    }
  }

  /**
   * Execute Firestore operations
   */
  async executeFirestoreOperation(db, operation, params) {
    const {
      doc,
      collection,
      addDoc,
      getDoc,
      getDocs,
      updateDoc,
      deleteDoc,
      query,
    } = await import("firebase/firestore");

    const { action, collectionName, docId, data, queryConstraints } = operation;

    switch (action) {
      case "add":
        const collRef = collection(db, collectionName);
        return await addDoc(collRef, data);
      case "get":
        const docRef = doc(db, collectionName, docId);
        return await getDoc(docRef);
      case "update":
        const updateRef = doc(db, collectionName, docId);
        return await updateDoc(updateRef, data);
      case "delete":
        const deleteRef = doc(db, collectionName, docId);
        return await deleteDoc(deleteRef);
      case "query":
        const queryRef = query(
          collection(db, collectionName),
          ...queryConstraints,
        );
        return await getDocs(queryRef);
      default:
        throw new Error(`Unsupported Firestore action: ${action}`);
    }
  }

  /**
   * Schema management
   */
  async createSchema(provider, schemaDefinition) {
    const connection = this.connections.get(provider);
    if (!connection) {
      throw new Error(`No connection for provider: ${provider}`);
    }

    this.schemas.set(`${provider}:${schemaDefinition.name}`, schemaDefinition);

    switch (provider) {
      case "postgresql":
      case "mysql":
        return await this.createSQLSchema(
          connection,
          schemaDefinition,
          provider,
        );
      case "mongodb":
        return await this.createMongoSchema(connection, schemaDefinition);
      case "dynamodb":
        return await this.createDynamoSchema(connection, schemaDefinition);
      case "cosmosdb":
        return await this.createCosmosSchema(connection, schemaDefinition);
      case "firestore":
        return await this.createFirestoreSchema(connection, schemaDefinition);
      default:
        throw new Error(`Schema creation not supported for: ${provider}`);
    }
  }

  /**
   * Create SQL schema
   */
  async createSQLSchema(connection, schema, provider) {
    const { name, fields, indexes = [], constraints = [] } = schema;

    let sql = `CREATE TABLE IF NOT EXISTS ${name} (\n`;

    // Add fields
    const fieldDefinitions = fields.map((field) => {
      let definition = `  ${field.name} ${this.getSQLType(field.type, provider)}`;

      if (field.primaryKey) definition += " PRIMARY KEY";
      if (field.autoIncrement)
        definition += provider === "postgresql" ? " SERIAL" : " AUTO_INCREMENT";
      if (field.notNull) definition += " NOT NULL";
      if (field.unique) definition += " UNIQUE";
      if (field.default !== undefined)
        definition += ` DEFAULT ${field.default}`;

      return definition;
    });

    sql += fieldDefinitions.join(",\n");

    // Add constraints
    if (constraints.length > 0) {
      sql += ",\n" + constraints.map((c) => `  ${c}`).join(",\n");
    }

    sql += "\n)";

    await connection.query(sql);

    // Create indexes
    for (const index of indexes) {
      const indexSQL = `CREATE INDEX IF NOT EXISTS ${index.name} ON ${name} (${index.columns.join(", ")})`;
      await connection.query(indexSQL);
    }

    return { table: name, created: true };
  }

  /**
   * Get SQL type mapping
   */
  getSQLType(type, provider) {
    const typeMap = {
      postgresql: {
        string: "VARCHAR(255)",
        text: "TEXT",
        integer: "INTEGER",
        bigint: "BIGINT",
        float: "REAL",
        double: "DOUBLE PRECISION",
        boolean: "BOOLEAN",
        date: "DATE",
        datetime: "TIMESTAMP",
        json: "JSONB",
        uuid: "UUID",
      },
      mysql: {
        string: "VARCHAR(255)",
        text: "TEXT",
        integer: "INT",
        bigint: "BIGINT",
        float: "FLOAT",
        double: "DOUBLE",
        boolean: "BOOLEAN",
        date: "DATE",
        datetime: "DATETIME",
        json: "JSON",
        uuid: "CHAR(36)",
      },
    };

    return typeMap[provider][type] || "VARCHAR(255)";
  }

  /**
   * Migration system
   */
  addMigration(migration) {
    this.migrations.push({
      id: migration.id || Date.now().toString(),
      name: migration.name,
      up: migration.up,
      down: migration.down,
      timestamp: new Date(),
    });
  }

  async runMigrations() {
    console.log(chalk.blue("🔄 Running database migrations..."));

    for (const migration of this.migrations) {
      if (!this.migrationHistory.has(migration.id)) {
        try {
          console.log(chalk.yellow(`⏳ Running migration: ${migration.name}`));
          await migration.up(this);
          this.migrationHistory.add(migration.id);
          console.log(chalk.green(`✅ Migration completed: ${migration.name}`));
        } catch (error) {
          console.error(
            chalk.red(`❌ Migration failed: ${migration.name}`),
            error,
          );
          throw error;
        }
      }
    }
  }

  /**
   * Real-time features setup
   */
  async setupRealtimeFeatures() {
    const httpServer = createServer();
    this.socketServer = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.socketServer.on("connection", (socket) => {
      console.log(chalk.blue(`🔌 Client connected: ${socket.id}`));

      socket.on("subscribe", (channel) => {
        socket.join(channel);
        console.log(
          chalk.green(`📺 Client ${socket.id} subscribed to ${channel}`),
        );
      });

      socket.on("unsubscribe", (channel) => {
        socket.leave(channel);
        console.log(
          chalk.yellow(`📺 Client ${socket.id} unsubscribed from ${channel}`),
        );
      });

      socket.on("disconnect", () => {
        console.log(chalk.yellow(`🔌 Client disconnected: ${socket.id}`));
      });
    });

    const port = process.env.REALTIME_PORT || 3001;
    httpServer.listen(port);
    console.log(chalk.green(`🚀 Real-time server listening on port ${port}`));
  }

  /**
   * Publish real-time event
   */
  publish(channel, data) {
    if (this.socketServer) {
      this.socketServer.to(channel).emit("data", data);
    }
    this.pubsub.publish(channel, data);
  }

  /**
   * Subscribe to real-time events
   */
  subscribe(channel, callback) {
    return this.pubsub.asyncIterator(channel);
  }

  /**
   * Generate REST API routes
   */
  generateRESTAPI(schema) {
    const { name, fields } = schema;
    const routes = {};

    // GET /api/{name} - List all
    routes[`GET /api/${name}`] = async (req, res) => {
      try {
        const { page = 1, limit = 10, ...filters } = req.query;
        const queryBuilder = this.queryBuilders.get(
          this.config.defaultProvider,
        );

        const result = await queryBuilder
          .select("*")
          .from(name)
          .where(filters)
          .limit(parseInt(limit))
          .offset((parseInt(page) - 1) * parseInt(limit))
          .execute();

        res.json({
          data: result,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: result.length,
          },
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

    // GET /api/{name}/:id - Get by ID
    routes[`GET /api/${name}/:id`] = async (req, res) => {
      try {
        const queryBuilder = this.queryBuilders.get(
          this.config.defaultProvider,
        );
        const result = await queryBuilder
          .select("*")
          .from(name)
          .where({ id: req.params.id })
          .first()
          .execute();

        if (!result) {
          return res.status(404).json({ error: "Not found" });
        }

        res.json({ data: result });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

    // POST /api/{name} - Create
    routes[`POST /api/${name}`] = async (req, res) => {
      try {
        const queryBuilder = this.queryBuilders.get(
          this.config.defaultProvider,
        );
        const result = await queryBuilder
          .insert(req.body)
          .into(name)
          .returning("*")
          .execute();

        // Publish real-time event
        this.publish(`${name}:created`, result);

        res.status(201).json({ data: result });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };

    // PUT /api/{name}/:id - Update
    routes[`PUT /api/${name}/:id`] = async (req, res) => {
      try {
        const queryBuilder = this.queryBuilders.get(
          this.config.defaultProvider,
        );
        const result = await queryBuilder
          .update(req.body)
          .where({ id: req.params.id })
          .table(name)
          .returning("*")
          .execute();

        if (!result) {
          return res.status(404).json({ error: "Not found" });
        }

        // Publish real-time event
        this.publish(`${name}:updated`, result);

        res.json({ data: result });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };

    // DELETE /api/{name}/:id - Delete
    routes[`DELETE /api/${name}/:id`] = async (req, res) => {
      try {
        const queryBuilder = this.queryBuilders.get(
          this.config.defaultProvider,
        );
        const result = await queryBuilder
          .delete()
          .from(name)
          .where({ id: req.params.id })
          .returning("*")
          .execute();

        if (!result) {
          return res.status(404).json({ error: "Not found" });
        }

        // Publish real-time event
        this.publish(`${name}:deleted`, { id: req.params.id });

        res.status(204).send();
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

    this.restRoutes.set(name, routes);
    return routes;
  }

  /**
   * Generate GraphQL resolvers
   */
  generateGraphQLResolvers(schema) {
    const { name, fields } = schema;
    const typeName = name.charAt(0).toUpperCase() + name.slice(1);

    const resolvers = {
      Query: {
        [`${name}s`]: async (parent, args, context) => {
          const queryBuilder = this.queryBuilders.get(
            this.config.defaultProvider,
          );
          return await queryBuilder.select("*").from(name).execute();
        },

        [name]: async (parent, args, context) => {
          const queryBuilder = this.queryBuilders.get(
            this.config.defaultProvider,
          );
          return await queryBuilder
            .select("*")
            .from(name)
            .where({ id: args.id })
            .first()
            .execute();
        },
      },

      Mutation: {
        [`create${typeName}`]: async (parent, args, context) => {
          const queryBuilder = this.queryBuilders.get(
            this.config.defaultProvider,
          );
          const result = await queryBuilder
            .insert(args.input)
            .into(name)
            .returning("*")
            .execute();

          this.publish(`${name}:created`, result);
          return result;
        },

        [`update${typeName}`]: async (parent, args, context) => {
          const queryBuilder = this.queryBuilders.get(
            this.config.defaultProvider,
          );
          const result = await queryBuilder
            .update(args.input)
            .where({ id: args.id })
            .table(name)
            .returning("*")
            .execute();

          this.publish(`${name}:updated`, result);
          return result;
        },

        [`delete${typeName}`]: async (parent, args, context) => {
          const queryBuilder = this.queryBuilders.get(
            this.config.defaultProvider,
          );
          await queryBuilder
            .delete()
            .from(name)
            .where({ id: args.id })
            .execute();

          this.publish(`${name}:deleted`, { id: args.id });
          return true;
        },
      },

      Subscription: {
        [`${name}Created`]: {
          subscribe: () => this.subscribe(`${name}:created`),
        },

        [`${name}Updated`]: {
          subscribe: () => this.subscribe(`${name}:updated`),
        },

        [`${name}Deleted`]: {
          subscribe: () => this.subscribe(`${name}:deleted`),
        },
      },
    };

    this.graphqlResolvers.set(name, resolvers);
    return resolvers;
  }

  /**
   * Close all connections
   */
  async close() {
    for (const [provider, connection] of this.connections.entries()) {
      try {
        switch (provider) {
          case "postgresql":
          case "mysql":
            await connection.end();
            break;
          case "mongodb":
            await connection.client.close();
            break;
          // Other providers don't need explicit closing
        }
        console.log(chalk.green(`✅ Closed ${provider} connection`));
      } catch (error) {
        console.error(chalk.red(`❌ Error closing ${provider}:`), error);
      }
    }

    if (this.socketServer) {
      this.socketServer.close();
    }

    // Clear cache
    for (const timer of this.cacheTimers.values()) {
      clearTimeout(timer);
    }
    this.cache.clear();
    this.cacheTimers.clear();
  }
}

/**
 * Query Builder for unified database operations
 */
class QueryBuilder {
  constructor(provider, connection) {
    this.provider = provider;
    this.connection = connection;
    this.query = {
      type: null,
      table: null,
      select: ["*"],
      where: {},
      joins: [],
      orderBy: [],
      groupBy: [],
      having: {},
      limit: null,
      offset: null,
      returning: null,
    };
  }

  select(columns) {
    this.query.select = Array.isArray(columns) ? columns : [columns];
    this.query.type = "select";
    return this;
  }

  from(table) {
    this.query.table = table;
    return this;
  }

  where(conditions) {
    this.query.where = { ...this.query.where, ...conditions };
    return this;
  }

  join(table, on) {
    this.query.joins.push({ type: "INNER", table, on });
    return this;
  }

  leftJoin(table, on) {
    this.query.joins.push({ type: "LEFT", table, on });
    return this;
  }

  orderBy(column, direction = "ASC") {
    this.query.orderBy.push({ column, direction });
    return this;
  }

  groupBy(columns) {
    this.query.groupBy = Array.isArray(columns) ? columns : [columns];
    return this;
  }

  having(conditions) {
    this.query.having = { ...this.query.having, ...conditions };
    return this;
  }

  limit(count) {
    this.query.limit = count;
    return this;
  }

  offset(count) {
    this.query.offset = count;
    return this;
  }

  insert(data) {
    this.query.type = "insert";
    this.query.data = data;
    return this;
  }

  into(table) {
    this.query.table = table;
    return this;
  }

  update(data) {
    this.query.type = "update";
    this.query.data = data;
    return this;
  }

  table(tableName) {
    this.query.table = tableName;
    return this;
  }

  delete() {
    this.query.type = "delete";
    return this;
  }

  returning(columns) {
    this.query.returning = Array.isArray(columns) ? columns : [columns];
    return this;
  }

  first() {
    this.query.limit = 1;
    this.query.first = true;
    return this;
  }

  async execute() {
    const sql = this.buildSQL();
    const params = this.buildParams();

    try {
      switch (this.provider) {
        case "postgresql":
        case "mysql":
          const result = await this.connection.query(sql, params);
          return this.query.first
            ? result.rows?.[0] || result[0]?.[0]
            : result.rows || result[0];

        case "mongodb":
          return await this.executeMongoQuery();

        default:
          throw new Error(
            `Query execution not supported for: ${this.provider}`,
          );
      }
    } catch (error) {
      console.error(
        chalk.red(`Query execution failed (${this.provider}):`),
        error,
      );
      throw error;
    }
  }

  buildSQL() {
    switch (this.query.type) {
      case "select":
        return this.buildSelectSQL();
      case "insert":
        return this.buildInsertSQL();
      case "update":
        return this.buildUpdateSQL();
      case "delete":
        return this.buildDeleteSQL();
      default:
        throw new Error(`Unsupported query type: ${this.query.type}`);
    }
  }

  buildSelectSQL() {
    let sql = `SELECT ${this.query.select.join(", ")} FROM ${this.query.table}`;

    // Joins
    for (const join of this.query.joins) {
      sql += ` ${join.type} JOIN ${join.table} ON ${join.on}`;
    }

    // Where clause
    const whereClause = this.buildWhereClause();
    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }

    // Group By
    if (this.query.groupBy.length > 0) {
      sql += ` GROUP BY ${this.query.groupBy.join(", ")}`;
    }

    // Having
    const havingClause = this.buildHavingClause();
    if (havingClause) {
      sql += ` HAVING ${havingClause}`;
    }

    // Order By
    if (this.query.orderBy.length > 0) {
      const orderClauses = this.query.orderBy.map(
        (o) => `${o.column} ${o.direction}`,
      );
      sql += ` ORDER BY ${orderClauses.join(", ")}`;
    }

    // Limit and Offset
    if (this.query.limit !== null) {
      sql += ` LIMIT ${this.query.limit}`;
    }

    if (this.query.offset !== null) {
      sql += ` OFFSET ${this.query.offset}`;
    }

    return sql;
  }

  buildInsertSQL() {
    const data = this.query.data;
    const columns = Object.keys(data);
    const placeholders = columns.map((_, i) => this.getPlaceholder(i + 1));

    let sql = `INSERT INTO ${this.query.table} (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`;

    if (this.query.returning) {
      sql += ` RETURNING ${this.query.returning.join(", ")}`;
    }

    return sql;
  }

  buildUpdateSQL() {
    const data = this.query.data;
    const columns = Object.keys(data);
    const setClauses = columns.map(
      (col, i) => `${col} = ${this.getPlaceholder(i + 1)}`,
    );

    let sql = `UPDATE ${this.query.table} SET ${setClauses.join(", ")}`;

    const whereClause = this.buildWhereClause(columns.length);
    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }

    if (this.query.returning) {
      sql += ` RETURNING ${this.query.returning.join(", ")}`;
    }

    return sql;
  }

  buildDeleteSQL() {
    let sql = `DELETE FROM ${this.query.table}`;

    const whereClause = this.buildWhereClause();
    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }

    if (this.query.returning) {
      sql += ` RETURNING ${this.query.returning.join(", ")}`;
    }

    return sql;
  }

  buildWhereClause(paramOffset = 0) {
    const conditions = Object.keys(this.query.where);
    if (conditions.length === 0) return "";

    return conditions
      .map((key, i) => `${key} = ${this.getPlaceholder(i + 1 + paramOffset)}`)
      .join(" AND ");
  }

  buildHavingClause() {
    const conditions = Object.keys(this.query.having);
    if (conditions.length === 0) return "";

    return conditions.map((key) => `${key} = ?`).join(" AND ");
  }

  buildParams() {
    const params = [];

    if (this.query.type === "insert") {
      params.push(...Object.values(this.query.data));
    } else if (this.query.type === "update") {
      params.push(...Object.values(this.query.data));
      params.push(...Object.values(this.query.where));
    } else {
      params.push(...Object.values(this.query.where));
    }

    return params;
  }

  getPlaceholder(index) {
    return this.provider === "postgresql" ? `$${index}` : "?";
  }

  async executeMongoQuery() {
    const db = this.connection;
    const collection = db.collection(this.query.table);

    switch (this.query.type) {
      case "select":
        const cursor = collection.find(this.query.where);

        if (this.query.orderBy.length > 0) {
          const sort = {};
          for (const order of this.query.orderBy) {
            sort[order.column] = order.direction === "DESC" ? -1 : 1;
          }
          cursor.sort(sort);
        }

        if (this.query.offset) cursor.skip(this.query.offset);
        if (this.query.limit) cursor.limit(this.query.limit);

        const results = await cursor.toArray();
        return this.query.first ? results[0] : results;

      case "insert":
        const insertResult = await collection.insertOne(this.query.data);
        return { ...this.query.data, _id: insertResult.insertedId };

      case "update":
        const updateResult = await collection.updateMany(this.query.where, {
          $set: this.query.data,
        });
        return updateResult;

      case "delete":
        const deleteResult = await collection.deleteMany(this.query.where);
        return deleteResult;

      default:
        throw new Error(`Unsupported MongoDB query type: ${this.query.type}`);
    }
  }
}

export default DatabaseIntegration;
