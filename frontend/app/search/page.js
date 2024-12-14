"use client";
import { useEffect, useState } from 'react';
import styles from '../../styles/Search.module.css';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { API_URL } from '../../utils/api';
import { useSearchParams } from 'next/navigation';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!q) return;
      
      setLoading(true);
      try {
        const response = await fetch( API_URL + `/search?q=${encodeURIComponent(q)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [q]);

  if (!q) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <FaSearch className={styles.searchIcon} />
          Search Results for "{q}"
        </h1>
        <p className={styles.resultCount}>
          {results.length} {results.length === 1 ? 'result' : 'results'} found
        </p>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Searching...</p>
        </div>
      ) : results.length === 0 ? (
        <div className={styles.noResults}>
          <FaSearch className={styles.noResultsIcon} />
          <h2>No results found</h2>
          <p>Try different keywords or browse our categories</p>
        </div>
      ) : (
        <div className={styles.results}>
          {results.map((product) => (
            <div key={product.id} className={styles.product}>
              <div className={styles.productImage}>
                <img src={API_URL + "/images/" + product.image} alt={product.title} />
              </div>
              <div className={styles.productInfo}>
                <h2>{product.title}</h2>
                <p className={styles.description}>{product.description}</p>
                <div className={styles.productFooter}>
                  <span className={styles.price}>${product.price}</span>
                  <button className={styles.addToCart}>
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
