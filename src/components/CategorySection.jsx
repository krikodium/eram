import React from 'react';
import ProductList from './ProductList';
import './CategorySection.css';

function CategorySection({ categoryName, products }) {
  return (
    <section className="category-section">
      <h2 className="category-header">{categoryName}</h2>
      <ProductList productos={products} />
    </section>
  );
}

export default CategorySection;