#!/usr/bin/env node

/**
 * ERAM Catalog Issue Debugger
 * 
 * This script investigates the specific issue where:
 * - Chain products show "No especificada" in product detail
 * - Category filtering shows cross-products
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

class CatalogIssueDebugger {
  constructor() {
    this.results = {
      chainProducts: [],
      categories: [],
      issues: []
    };
  }

  async run() {
    console.log('🔍 ERAM Catalog Issue Debugger');
    console.log('=' .repeat(50));
    console.log('📅 Started at:', new Date().toLocaleString());
    console.log('');

    try {
      await this.fetchCategories();
      await this.testChainProductQueries();
      await this.testCategoryFiltering();
      this.displayResults();
      
    } catch (error) {
      console.error('❌ Error during analysis:', error.message);
      process.exit(1);
    }
  }

  async fetchCategories() {
    console.log('📋 Fetching categories...');
    
    const { data: categories, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre');

    if (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }

    this.results.categories = categories || [];
    console.log(`✅ Found ${this.results.categories.length} categories`);
  }

  async testChainProductQueries() {
    console.log('🔗 Testing chain product queries...');
    
    // Test 1: Get chain product by ID (like in product detail)
    const chainProductId = 229; // Based on the URL in the image
    console.log(`\n📦 Testing product ID ${chainProductId} (Cadena plástica eslabón 6 mm):`);
    
    const { data: product, error: productError } = await supabase
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
      .eq('id', chainProductId)
      .single();

    if (productError) {
      console.log(`❌ Error fetching product: ${productError.message}`);
    } else if (product) {
      console.log(`✅ Product found: ${product.nombre}`);
      console.log(`   Código: ${product.codigo}`);
      console.log(`   Category ID: ${product.categoria_id}`);
      console.log(`   Category Name: "${product.categorias?.nombre || 'N/A'}"`);
      
      if (!product.categorias || product.categorias.nombre === 'No especificada') {
        this.results.issues.push({
          type: 'JOIN_ISSUE',
          product: product,
          message: 'Product join is not working correctly'
        });
      }
    } else {
      console.log(`❌ Product with ID ${chainProductId} not found`);
    }

    // Test 2: Get all chain products
    console.log(`\n🔗 Testing all chain products:`);
    
    const { data: chainProducts, error: chainError } = await supabase
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
      .ilike('nombre', '%cadena%')
      .limit(5);

    if (chainError) {
      console.log(`❌ Error fetching chain products: ${chainError.message}`);
    } else {
      console.log(`✅ Found ${chainProducts.length} chain products:`);
      chainProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.nombre} - Category: "${product.categorias?.nombre || 'N/A'}"`);
      });
    }
  }

  async testCategoryFiltering() {
    console.log('\n🏷️  Testing category filtering...');
    
    // Test filtering by "Señalización Vial" category (ID: 27)
    const señalizacionVialId = 27;
    console.log(`\n📋 Testing products in category ID ${señalizacionVialId} (Señalización Vial):`);
    
    const { data: products, error: productsError } = await supabase
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
      .eq('categoria_id', señalizacionVialId)
      .limit(10);

    if (productsError) {
      console.log(`❌ Error fetching products by category: ${productsError.message}`);
    } else {
      console.log(`✅ Found ${products.length} products in "Señalización Vial":`);
      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.nombre} (${product.codigo})`);
      });
    }

    // Test if there are products from other categories showing up
    console.log(`\n🔍 Checking for cross-contamination in category filtering:`);
    
    const { data: allProducts, error: allError } = await supabase
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
      .eq('categoria_id', señalizacionVialId);

    if (allError) {
      console.log(`❌ Error: ${allError.message}`);
    } else {
      // Check for non-chain products in señalización vial
      const nonChainProducts = allProducts.filter(product => 
        !product.nombre.toLowerCase().includes('cadena') &&
        !product.nombre.toLowerCase().includes('señal') &&
        !product.nombre.toLowerCase().includes('cartel') &&
        !product.nombre.toLowerCase().includes('cono')
      );
      
      if (nonChainProducts.length > 0) {
        console.log(`⚠️  Found ${nonChainProducts.length} non-signalization products in "Señalización Vial":`);
        nonChainProducts.forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.nombre} (${product.codigo})`);
        });
        
        this.results.issues.push({
          type: 'CROSS_CONTAMINATION',
          products: nonChainProducts,
          message: 'Non-signalization products found in Señalización Vial category'
        });
      } else {
        console.log(`✅ No cross-contamination found in "Señalización Vial" category`);
      }
    }
  }

  displayResults() {
    console.log('\n📊 CATALOG ISSUE ANALYSIS');
    console.log('=' .repeat(50));
    
    if (this.results.issues.length === 0) {
      console.log('✅ No issues found in the database queries!');
      console.log('\n💡 The problem might be in the frontend code:');
      console.log('   1. Check the ProductDetail component query');
      console.log('   2. Check the Catalogo component filtering logic');
      console.log('   3. Check if there are any caching issues');
      console.log('   4. Check if the frontend is using the correct API endpoints');
    } else {
      console.log(`⚠️  Found ${this.results.issues.length} issues:`);
      
      this.results.issues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.type}:`);
        console.log(`   ${issue.message}`);
        
        if (issue.product) {
          console.log(`   Product: ${issue.product.nombre} (${issue.product.codigo})`);
        }
        
        if (issue.products) {
          console.log(`   Affected products: ${issue.products.length}`);
        }
      });
    }

    console.log('\n🔧 DEBUGGING STEPS:');
    console.log('1. Check browser console for JavaScript errors');
    console.log('2. Check Network tab for failed API calls');
    console.log('3. Verify the frontend is using the correct Supabase client');
    console.log('4. Check if there are any environment variable issues');
    console.log('5. Test the API calls directly in the browser console');

    console.log('\n📝 FRONTEND DEBUGGING QUERIES:');
    console.log('// Test in browser console:');
    console.log('const { data, error } = await supabase');
    console.log('  .from("productos")');
    console.log('  .select(`id, nombre, codigo, categoria_id, categorias (id, nombre)`)');
    console.log('  .eq("id", 229)');
    console.log('  .single();');
    console.log('console.log(data, error);');

    console.log('\n' + '=' .repeat(50));
  }
}

// Execute the script
if (require.main === module) {
  const catalogDebugger = new CatalogIssueDebugger();
  catalogDebugger.run().catch(error => {
    console.error('❌ Script execution failed:', error);
    process.exit(1);
  });
}

module.exports = CatalogIssueDebugger;
