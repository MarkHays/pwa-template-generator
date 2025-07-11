/**
 * Enhanced PWA Generation Workflow
 *
 * This workflow uses the enhanced validation system to ensure
 * zero manual issues in generated projects.
 */

import { WebDirectProjectGenerator } from '../utils/WebDirectProjectGenerator';

export class EnhancedPWAGenerator {
  private generator: WebDirectProjectGenerator;

  constructor() {
    this.generator = new WebDirectProjectGenerator({ typescript: true });
  }

  async generateProject(config: any): Promise<{
    files: any[];
    validationResult: any;
    ready: boolean;
  }> {
    console.log('🚀 Starting Enhanced PWA Generation...');

    try {
      // Generate project files
      console.log('📁 Generating project files...');
      const files = await this.generator.generateProject(config);

      // Run enhanced validation
      console.log('🔍 Running enhanced validation...');
      const validationResult = await this.generator.validateGeneratedProject(files, config);

      // Determine if project is ready
      const ready = validationResult.finalStatus === 'READY_TO_USE';

      console.log(`✅ Enhanced PWA Generation complete: ${ready ? 'READY' : 'NEEDS_ATTENTION'}`);
      console.log(`📊 Results: ${validationResult.autoFixedCount} fixed, ${validationResult.preventedIssuesCount} prevented`);

      return {
        files: validationResult.fixedFiles,
        validationResult,
        ready
      };

    } catch (error) {
      console.error('❌ Enhanced PWA Generation failed:', error);
      throw error;
    }
  }
}

export default EnhancedPWAGenerator;
