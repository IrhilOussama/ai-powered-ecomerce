import { useEffect, useState } from 'react';
import { FaBars, FaSearch, FaShoppingCart, FaUser, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      console.log(`${API_URL}/images/`);
      try {
        const response = await fetch(`${API_URL}/images/`, {
          method: 'GET', // Specify the HTTP method
          headers: {
            'Accept': 'application/json', // Indicate that you expect a JSON response
            // 'ngrok-skip-browser-warning': "potato"
          },
        });
        console.log(response)

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
    console.log(1)
    router.push(`/product/${productId}`);
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h2>Welcome to Your Store</h2>
            <p>Discover amazing products at great prices</p>
          </div>
        </div>
      </section>

      <section className={styles.featuredProducts}>
        <div className={styles.container}>
          <h2>Featured Products</h2>
          {loading ? (
            <div className={styles.loader} id="loader">
              <div></div><div></div><div></div>
            </div>
          ) : (
            <div className={styles.products}>
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className={styles.productCard}
                  onClick={() => handleProductClick(product.id)}
                >
                  <img src={product.image} alt={product.title} />
                  <div className={styles.productInfo}>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <p className={styles.price}>${product.price}</p>
                    <button className={styles.addToCart}>Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
