#!/usr/bin/env node

/**
 * ERAM Chain Analysis - Specific Analysis for Chain Products
 * 
 * This script analyzes chain products and their category assignments
 * to identify the specific issue mentioned by the user.
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

class ChainAnalyzer {
  constructor() {
    this.results = {
      chainProducts: [],
      categories: [],
      issues: []
    };
  }

  async run() {
    console.log('🔗 ERAM Chain Products Analysis');
    console.log('=' .repeat(50));
    console.log('📅 Started at:', new Date().toLocaleString());
    console.log('');

    try {
      await this.fetchCategories();
      await this.fetchChainProducts();
      await this.analyzeChainCategories();
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

  async fetchChainProducts() {
    console.log('🔗 Fetching chain products...');
    
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
      .ilike('nombre', '%cadena%')
      .order('nombre');

    if (error) {
      throw new Error(`Error fetching chain products: ${error.message}`);
    }

    this.results.chainProducts = products || [];
    console.log(`✅ Found ${this.results.chainProducts.length} chain products`);
  }

  async analyzeChainCategories() {
    console.log('🔍 Analyzing chain product categories...');
    
    const categoryMap = new Map();
    this.results.categories.forEach(cat => {
      categoryMap.set(cat.id, cat);
    });

    this.results.chainProducts.forEach(product => {
      const issues = [];
      
      // Check if product has category
      if (!product.categoria_id) {
        issues.push({
          type: 'NO_CATEGORY',
          message: 'Product has no category assigned'
        });
      } else {
        const category = categoryMap.get(product.categoria_id);
        if (!category) {
          issues.push({
            type: 'INVALID_CATEGORY',
            message: `Product references non-existent category ID: ${product.categoria_id}`
          });
        } else {
          // Check if category name makes sense for chains
          const categoryName = category.nombre.toLowerCase();
          const productName = product.nombre.toLowerCase();
          
          if (categoryName === 'sin categoría') {
            issues.push({
              type: 'UNSPECIFIED_CATEGORY',
              message: 'Product has "Sin Categoría" assigned'
            });
          }
          
          // Check for logical category assignments
          const logicalCategories = [
            'señalización vial',
            'señalizacion vial', 
            'señalización industrial',
            'señalizacion industrial',
            'cintas industriales'
          ];
          
          const isLogicalCategory = logicalCategories.some(logical => 
            categoryName.includes(logical)
          );
          
          if (!isLogicalCategory) {
            issues.push({
              type: 'ILLOGICAL_CATEGORY',
              message: `Product "${product.nombre}" is in category "${category.nombre}" which doesn't seem logical for chain products`
            });
          }
        }
      }

      if (issues.length > 0) {
        this.results.issues.push({
          product: product,
          issues: issues
        });
      }
    });

    console.log(`⚠️  Found ${this.results.issues.length} chain products with issues`);
  }

  displayResults() {
    console.log('\n📊 CHAIN PRODUCTS ANALYSIS');
    console.log('=' .repeat(50));
    
    console.log('\n🔗 CHAIN PRODUCTS FOUND:');
    this.results.chainProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.nombre}`);
      console.log(`   Código: ${product.codigo}`);
      console.log(`   Category ID: ${product.categoria_id || 'None'}`);
      console.log(`   Category Name: "${product.categorias?.nombre || 'N/A'}"`);
    });

    if (this.results.issues.length > 0) {
      console.log('\n⚠️  ISSUES FOUND:');
      this.results.issues.forEach((issue, index) => {
        console.log(`\n${index + 1}. Product: "${issue.product.nombre}"`);
        console.log(`   Código: ${issue.product.codigo}`);
        console.log(`   Current Category: "${issue.product.categorias?.nombre || 'N/A'}"`);
        console.log(`   Issues:`);
        issue.issues.forEach(problem => {
          console.log(`     - ${problem.type}: ${problem.message}`);
        });
      });
    } else {
      console.log('\n✅ No issues found with chain products!');
    }

    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. Chain products should be in "Señalización Vial" category');
    console.log('2. Products with "Sin Categoría" need proper category assignment');
    console.log('3. Review products in illogical categories');

    console.log('\n🔧 SUGGESTED FIXES:');
    const unspecifiedProducts = this.results.issues.filter(issue => 
      issue.issues.some(i => i.type === 'UNSPECIFIED_CATEGORY')
    );
    
    if (unspecifiedProducts.length > 0) {
      console.log('\n-- Fix "Sin Categoría" assignments:');
      unspecifiedProducts.forEach(issue => {
        console.log(`UPDATE productos SET categoria_id = 27 WHERE id = ${issue.product.id}; -- ${issue.product.nombre}`);
      });
    }

    const illogicalProducts = this.results.issues.filter(issue => 
      issue.issues.some(i => i.type === 'ILLOGICAL_CATEGORY')
    );
    
    if (illogicalProducts.length > 0) {
      console.log('\n-- Fix illogical category assignments:');
      illogicalProducts.forEach(issue => {
        console.log(`-- Review: ${issue.product.nombre} (${issue.product.codigo}) in "${issue.product.categorias?.nombre}"`);
        console.log(`-- Consider moving to "Señalización Vial" (ID: 27)`);
      });
    }

    console.log('\n' + '=' .repeat(50));
  }
}

// Execute the script
if (require.main === module) {
  const analyzer = new ChainAnalyzer();
  analyzer.run().catch(error => {
    console.error('❌ Script execution failed:', error);
    process.exit(1);
  });
}

module.exports = ChainAnalyzer;



