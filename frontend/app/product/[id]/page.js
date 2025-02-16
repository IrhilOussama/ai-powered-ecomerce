"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL, fetchFromAPI } from '../../../utils/api';
import styles from '../../../styles/Product.module.css';
import Image from 'next/image';
const loaderProp =({ src }) => {
  return src;
}

export default function ProductPage(props) {
  const router = useRouter();
  const [id, setId] = useState();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  useEffect(() => {
    const getId = async () => {
      const myProps = await props.params;
      setId(myProps.id)
    }
    getId()
  }, [])

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchSimilarProducts();
    }
  }, [product]);

  console.log(product)

  const fetchProduct = async () => {
    try {
      const data = await fetchFromAPI(`/products/${id}`, {
        method: 'GET', // Specify the HTTP method
        headers: {
          'Accept': 'application/json', // Indicate that you expect a JSON response
          // 'ngrok-skip-browser-warning': "potato"
        },
      });
      setProduct(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchSimilarProducts = async () => {
    try {
      setLoadingSimilar(true);
      let similarProductsIds = product['similar_products_ids'];
      console.log(similarProductsIds)
      let similarProductsDetails = await Promise.all(
        similarProductsIds.map( async (current_similar_product_id) => {
          return await fetchFromAPI(`/products/${current_similar_product_id}`, {
            method: 'GET', // Specify the HTTP method
            headers: {
              'Accept': 'application/json',
            },
          });
        })
      );
      // similarProductsDetails = similarProductsDetails.filter(product => product != null);

      setSimilarProducts(similarProductsDetails);
      setLoadingSimilar(false);
    } catch (error) {
      console.error('Error fetching similar products:', error);
      setLoadingSimilar(false);
    }
  };

  if (loading) return <div className={styles.loader}><div></div><div></div><div></div></div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className={styles.productPage}>
      <div className={styles.container}>
        <div className={styles.productContent}>
          <div className={styles.productImage}>
            {product.image && (
            //   <img 
            //     src={product.image} 
            //     alt={product.title}
            //     onError={(e) => {
            //       console.error('Image failed to load:', product.image);
            //       e.target.onerror = null;
            //       e.target.src = 'https://via.placeholder.com/400';
            //     }}
            //   />
            <Image
                src={API_URL + "/images/" + product.image}
                alt={product.title}
                width={500}
                height={500}
                loader={loaderProp}
          />
            )}
          </div>
          
          <div className={styles.productDetails}>
            <h1>{product.title}</h1>
            <p className={styles.price}>${product.price}</p>
            <p className={styles.description}>{product.description}</p>
            <p className={styles.category}>Category: {product.category}</p>
            
            <div className={styles.actions}>
              <div className={styles.quantity}>
                <button>-</button>
                <input type="number" defaultValue="1" min="1" />
                <button>+</button>
              </div>
              <button className={styles.addToCart}>Add to Cart</button>
            </div>

            <div className={styles.additionalInfo}>
              <div className={styles.infoItem}>
                <span>✓</span> Free Shipping
              </div>
              <div className={styles.infoItem}>
                <span>✓</span> In Stock
              </div>
              <div className={styles.infoItem}>
                <span>✓</span> Secure Payment
              </div>
            </div>
          </div>
        </div>

        <section className={styles.similarProducts}>
          <h2>Similar Products</h2>
          {loadingSimilar ? (
            <div className={styles.loader}><div></div><div></div><div></div></div>
          ) : (
            <div className={styles.similarProductsGrid}>
              {similarProducts.map((similarProduct, index) => (
                <Link
                  href={`/product/${similarProduct.id}`}
                  key={index}
                  className={styles.similarProductCard}
                >
                  <div className={styles.similarProductImage}>
                    <img 
                      src={API_URL + "/images/" + similarProduct.image} 
                      alt={similarProduct.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.png';
                      }}
                    />
                  </div>
                  <div className={styles.similarProductInfo}>
                    <h3>{similarProduct.title}</h3>
                    <p className={styles.similarProductPrice}>
                      ${similarProduct.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
} 