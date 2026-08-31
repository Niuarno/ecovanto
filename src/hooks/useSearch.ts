import { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'ALL'>('ALL');

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;

    if (selectedCategory !== 'ALL') {
      list = list.filter(
        (p) => p.categorySlug.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (!query.trim()) {
      return list;
    }

    const clean = query.trim().toLowerCase();
    return list.filter((p) => {
      const matchName = p.name.toLowerCase().includes(clean);
      const matchCategory = p.category.toLowerCase().includes(clean);
      const matchCollection = p.collection.toLowerCase().includes(clean);
      const matchDesc = p.description.toLowerCase().includes(clean);
      const matchTagline = p.tagline?.toLowerCase().includes(clean);
      return matchName || matchCategory || matchCollection || matchDesc || matchTagline;
    });
  }, [query, selectedCategory]);

  return {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    totalResults: filteredProducts.length,
  };
}
