import fetch from 'isomorphic-fetch';
import { Dropbox } from 'dropbox';
import fs from 'fs-extra';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import path from 'path';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function fetchPhotosFromDropbox(projectPath, clientFolder, sections = ['gallery', 'services', 'team', 'hero']) {
  if (!clientFolder) {
    console.log(chalk.yellow('No client folder specified. Skipping photo fetching.'));
    return;
  }

  const dbx = new Dropbox({ 
    accessToken: process.env.DROPBOX_TOKEN, 
    fetch 
  });
  
  console.log(chalk.blue(`Fetching photos for client: ${clientFolder}`));
  
  // Track which sections have photos
  const sectionsWithPhotos = {};
  
  // First pass: Check which sections have photos
  for (const section of sections) {
    try {
      const dropboxPath = `/WebsiteClients/${clientFolder}/${section}`;
      const response = await dbx.filesListFolder({ path: dropboxPath });
      
      // Filter for image files only
      const photos = response.result.entries.filter(file => 
        file['.tag'] === 'file' && 
        /\.(jpeg|jpg|png|gif)$/i.test(file.name)
      );
      
      sectionsWithPhotos[section] = photos.length > 0;
      console.log(chalk.blue(`  - Found ${photos.length} photos in ${section}`));
    } catch (error) {
      sectionsWithPhotos[section] = false;
      if (error.status === 409) {
        console.log(chalk.yellow(`    - Folder '${section}' not found for client`));
      } else {
        console.error(chalk.red(`  × Error checking ${section} folder: ${error.message}`));
      }
    }
  }
  
  // Now download photos for each section that has them
  for (const section of sections) {
    if (sectionsWithPhotos[section]) {
      await downloadSectionPhotos(dbx, clientFolder, section, projectPath);
    } else {
      // Handle missing sections by using placeholders or alternatives
      handleMissingSection(section, sectionsWithPhotos, projectPath);
    }
  }
}

// Helper function to download photos for a section
async function downloadSectionPhotos(dbx, clientFolder, section, projectPath) {
  try {
    // Create the target directory
    const targetDir = path.join(projectPath, 'src', 'assets', 'images', section);
    fs.ensureDirSync(targetDir);
    
    // Get files from Dropbox
    const dropboxPath = `/WebsiteClients/${clientFolder}/${section}`;
    const response = await dbx.filesListFolder({ path: dropboxPath });
    
    // Filter for image files only
    const photos = response.result.entries.filter(file => 
      file['.tag'] === 'file' && 
      /\.(jpeg|jpg|png|gif)$/i.test(file.name)
    );
    
    // Download each photo
    for (const photo of photos) {
      try {
        const fileName = photo.name;
        const filePath = path.join(targetDir, fileName);
        
        // Get file content
        const fileData = await dbx.filesDownload({ path: photo.path_lower });
        
        // Write file to disk
        fs.writeFileSync(filePath, Buffer.from(await fileData.result.fileBlob.arrayBuffer()));
        
        console.log(chalk.green(`    ✓ Downloaded: ${fileName}`));
      } catch (error) {
        console.error(chalk.red(`    × Error downloading ${photo.name}: ${error.message}`));
      }
    }
    
    console.log(chalk.green(`  ✓ ${photos.length} ${section} photos downloaded`));
  } catch (error) {
    console.error(chalk.red(`  × Error in downloadSectionPhotos for ${section}: ${error.message}`));
  }
}

// Helper function to handle missing sections
function handleMissingSection(section, sectionsWithPhotos, projectPath) {
  const targetDir = path.join(projectPath, 'src', 'assets', 'images', section);
  fs.ensureDirSync(targetDir);
  
  switch(section) {
    case 'team':
      console.log(chalk.blue('  - Adding placeholder team photos'));
      // Copy placeholder team photos from your generator template
      fs.copySync(
        path.join(__dirname, 'templates', 'placeholder-images', 'team'),
        targetDir
      );
      break;
      
    case 'services':
      if (sectionsWithPhotos['gallery']) {
        console.log(chalk.blue('  - Using gallery photos for services'));
        // Copy some gallery photos to use for services
        const galleryDir = path.join(projectPath, 'src', 'assets', 'images', 'gallery');
        
        // Make sure gallery directory exists before reading from it
        if (fs.existsSync(galleryDir)) {
          const galleryPhotos = fs.readdirSync(galleryDir).filter(file => 
            /\.(jpeg|jpg|png|gif)$/i.test(file)
          );
          
          // Take up to 4 gallery photos to use for services
          const photosToUse = galleryPhotos.slice(0, Math.min(4, galleryPhotos.length));
          
          photosToUse.forEach((photo, index) => {
            fs.copySync(
              path.join(galleryDir, photo),
              path.join(targetDir, `service-${index+1}${path.extname(photo)}`)
            );
          });
        } else {
          console.log(chalk.yellow('  - Gallery directory not found, using placeholder services images'));
          fs.copySync(
            path.join(__dirname, 'templates', 'placeholder-images', 'services'),
            targetDir
          );
        }
      } else {
        console.log(chalk.blue('  - Adding placeholder service photos'));
        // Copy placeholder service photos
        fs.copySync(
          path.join(__dirname, 'templates', 'placeholder-images', 'services'),
          targetDir
        );
      }
      break;
      
    case 'hero':
      console.log(chalk.blue('  - Adding placeholder hero image'));
      // Copy placeholder hero image
      fs.copySync(
        path.join(__dirname, 'templates', 'placeholder-images', 'hero'),
        targetDir
      );
      break;
      
      case 'gallery':
  console.log(chalk.blue('  - Adding placeholder gallery photos'));
  // Copy placeholder gallery photos from your generator template
  fs.copySync(
    path.join(__dirname, 'templates', 'placeholder-images', 'gallery'),
    targetDir
  );
  break;
    default:
      console.log(chalk.yellow(`  - No handling for missing ${section} photos`));
  }
}