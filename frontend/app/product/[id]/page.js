"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL, fetchFromAPI } from '../../../utils/api';
import styles from '../../../styles/Product.module.css';
import Image from 'next/image';
import { ImAndroid } from 'react-icons/im';
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
      console.log(id)
      fetchProduct();
    }
  }, [id]);

  console.log(id)

  console.log(product)

  // Fetch similar products when product data is available
  useEffect(() => {
    if (product?.image) {
      fetchSimilarProducts(product.image);
    }
  }, [product]);

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

  const fetchSimilarProducts = async (imageUrl) => {
    try {
      setLoadingSimilar(true);
      
      // Create FormData object
      const formData = new FormData();
      let array = imageUrl.split('/');
      const filename = array[array.length - 1];
      formData.append('url', filename);

      const response = await fetch(`${API_URL}/similar_product/${filename}`);

      const data = await response.json();
      // console.log(data)
      // Fetch details for each similar product
      // console.log(data);
      let similarProductsDetails = await Promise.all(
        data.similar_images.map(async (url) => {
          const id = url.split('/').pop().split('.')[0];
          const detailsResponse = await fetch(`${API_URL}/products/${id}`,{
            method: 'GET', // Specify the HTTP method
            headers: {
              'Accept': 'application/json', // Indicate that you expect a JSON response
              'ngrok-skip-browser-warning': "potato"
            },
          });
          try{
            const object = await detailsResponse.json();
            return object;
          } catch(e){
            console.error("error while looping on the similar images object: " + e);
          }
        })
      );
      similarProductsDetails = similarProductsDetails.filter(product => product != null);

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
                        e.target.src = 'https://via.placeholder.com/200';
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