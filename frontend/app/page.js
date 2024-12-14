'use client';
import { useEffect, useState } from 'react';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;



export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  if (!products) return null;
  return (
    <div className={styles.pageWrapper}>


      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Welcome to AI Store</h1>
            <p>Discover the future of shopping with AI-powered recommendations</p>
          </div>
        </section>

        <section className={styles.mainNav}>
          <div className={styles.container}>
            <div className={styles.navGrid}>
              <Link href="/new-arrivals">
                <div className={styles.navItem}>
                  <div className={styles.navIcon}>🆕</div>
                  <h3>New Arrivals</h3>
                  <p>Check out our latest products</p>
                </div>
              </Link>
              <Link href="/categories">
                <div className={styles.navItem}>
                  <div className={styles.navIcon}>📑</div>
                  <h3>Categories</h3>
                  <p>Browse by category</p>
                </div>
              </Link>
              <Link href="/deals">
                <div className={styles.navItem}>
                  <div className={styles.navIcon}>🏷️</div>
                  <h3>Deals</h3>
                  <p>Special offers and discounts</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.featuredProducts}>
          <div className={styles.sectionHeader}>
            <h2>Featured Products</h2>
            <p>Discover our handpicked selection just for you</p>
          </div>

          {loading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.loader}>
                <div></div><div></div><div></div>
              </div>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className={styles.productCard}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className={styles.productImageContainer}>
                    <img src={API_URL + "/images/" + product.image} alt={product.title} />
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{product.title}</h3>
                    <p className={styles.productDescription}>{product.description}</p>
                    <div className={styles.productFooter}>
                      <span className={styles.price}>${product.price}</span>
                      <button className={styles.addToCart}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>AI Store</h3>
            <p>Your AI-powered shopping destination</p>
          </div>
          <div className={styles.footerLinks}>
            <div>
              <h4>Shop</h4>
              <Link href="/"><div>New Arrivals</div></Link>
              <Link href="/"><div>Best Sellers</div></Link>
              <Link href="/"><div>Categories</div></Link>
            </div>
            <div>
              <h4>Help</h4>
              <Link href="/"><div>Contact Us</div></Link>
              <Link href="/"><div>Shipping</div></Link>
              <Link href="/"><div>Returns</div></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
