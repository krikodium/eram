#!/usr/bin/env node

/**
 * ERAM Category Contamination Fixer
 * 
 * This script fixes the cross-contamination in the "Señalización Vial" category
 * by moving products to their appropriate categories.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Supabase configuration
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// If not found in .env, try to read from the .env file directly
if (!supabaseUrl || !supabaseKey) {
  try {
    const envContent = require('fs').readFileSync('../.env', 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('VITE_SUPABASE_URL=')) {
        supabaseUrl = line.split('=')[1].trim();
      }
      if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
        supabaseKey = line.split('=')[1].trim();
      }
    }
  } catch (error) {
    console.error('❌ Error: Could not read .env file');
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

class CategoryContaminationFixer {
  constructor() {
    this.dryRun = process.argv.includes('--dry-run');
    this.results = {
      moved: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };
  }

  async run() {
    console.log('🔧 ERAM Category Contamination Fixer');
    console.log('=' .repeat(50));
    console.log('📅 Started at:', new Date().toLocaleString());
    console.log(`Mode: ${this.dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE UPDATE'}`);
    console.log('');

    try {
      await this.analyzeContamination();
      await this.fixContamination();
      this.displayResults();
      
    } catch (error) {
      console.error('❌ Error during fixing:', error.message);
      process.exit(1);
    }
  }

  async analyzeContamination() {
    console.log('🔍 Analyzing category contamination...');
    
    // Get all products in "Señalización Vial" (ID: 27)
    const { data: products, error } = await supabase
      .from('productos')
      .select(`
        id,
        nombre,
        codigo,
        categoria_id,
        categorias (
          id,
          nombre
        )
      `)
      .eq('categoria_id', 27);

    if (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }

    // Identify products that don't belong in "Señalización Vial"
    this.contaminatedProducts = products.filter(product => {
      const name = product.nombre.toLowerCase();
      const isSignalization = 
        name.includes('cadena') ||
        name.includes('señal') ||
        name.includes('cartel') ||
        name.includes('cono') ||
        name.includes('pancarta') ||
        name.includes('bandera') ||
        name.includes('delineador') ||
        name.includes('tope') ||
        name.includes('valla') ||
        name.includes('malla') ||
        name.includes('cinta') ||
        name.includes('faro') ||
        name.includes('poste') ||
        name.includes('lomo') ||
        name.includes('protector') ||
        name.includes('tacha') ||
        name.includes('esquinero') ||
        name.includes('calza');
      
      return !isSignalization;
    });

    console.log(`✅ Found ${products.length} products in "Señalización Vial"`);
    console.log(`⚠️  Found ${this.contaminatedProducts.length} products that don't belong there`);
  }

  async fixContamination() {
    console.log('\n🔧 Fixing contamination...');
    
    for (const product of this.contaminatedProducts) {
      try {
        const suggestedCategory = this.findBestCategory(product);
        
        if (suggestedCategory) {
          if (this.dryRun) {
            console.log(`🔍 DRY RUN: Move "${product.nombre}" to "${suggestedCategory.nombre}"`);
          } else {
            const { error } = await supabase
              .from('productos')
              .update({ categoria_id: suggestedCategory.id })
              .eq('id', product.id);

            if (error) {
              throw new Error(`Database error: ${error.message}`);
            }
            
            console.log(`✅ MOVED: "${product.nombre}" to "${suggestedCategory.nombre}"`);
          }
          
          this.results.moved++;
        } else {
          console.log(`⚠️  SKIP: "${product.nombre}" - no suitable category found`);
          this.results.skipped++;
        }
        
      } catch (error) {
        console.log(`❌ ERROR: "${product.nombre}" - ${error.message}`);
        this.results.failed++;
        this.results.errors.push({
          product: product,
          error: error.message
        });
      }
    }
  }

  findBestCategory(product) {
    const name = product.nombre.toLowerCase();
    
    // Define category mappings based on product names
    const categoryMappings = [
      { keywords: ['faro', 'batería', 'luminoso', 'led'], categoryId: 16, name: 'Incendio' },
      { keywords: ['faja', 'lumbar', 'refuerzo'], categoryId: 1, name: 'Sin Categoría' }, // These might need a proper category
      { keywords: ['tope', 'estacionamiento'], categoryId: 1, name: 'Sin Categoría' },
      { keywords: ['malla', 'advertencia', 'subterránea'], categoryId: 26, name: 'Señalización Vial' },
      { keywords: ['cinta', 'peligro'], categoryId: 26, name: 'Señalización Vial' },
      { keywords: ['bandera', 'tela'], categoryId: 26, name: 'Señalización Vial' },
      { keywords: ['poste', 'demarcatorio'], categoryId: 26, name: 'Señalización Vial' },
      { keywords: ['valla', 'extensible'], categoryId: 26, name: 'Señalización Vial' },
      { keywords: ['lomo', 'burro'], categoryId: 26, name: 'Señalización Vial' },
      { keywords: ['protector', 'cables'], categoryId: 1, name: 'Sin Categoría' },
      { keywords: ['tacha', 'reflectiva'], categoryId: 26, name: 'Señalización Vial' },
      { keywords: ['esquinero', 'goma'], categoryId: 1, name: 'Sin Categoría' },
      { keywords: ['calza', 'taco', 'rueda'], categoryId: 1, name: 'Sin Categoría' }
    ];

    for (const mapping of categoryMappings) {
      if (mapping.keywords.some(keyword => name.includes(keyword))) {
        return {
          id: mapping.categoryId,
          nombre: mapping.name
        };
      }
    }

    return null;
  }

  displayResults() {
    console.log('\n📊 CONTAMINATION FIX RESULTS');
    console.log('=' .repeat(50));
    console.log(`✅ Moved: ${this.results.moved}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Skipped: ${this.results.skipped}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.product.nombre}: ${error.error}`);
      });
    }

    if (this.dryRun) {
      console.log('\n💡 This was a dry run. No changes were made to the database.');
      console.log('   Run without --dry-run to apply the changes.');
    } else {
      console.log('\n✅ Contamination fix completed!');
      console.log('   Run the analysis again to verify the results.');
    }
  }
}

// Execute the script
if (require.main === module) {
  const fixer = new CategoryContaminationFixer();
  fixer.run().catch(error => {
    console.error('❌ Script execution failed:', error);
    process.exit(1);
  });
}

module.exports = CategoryContaminationFixer;



