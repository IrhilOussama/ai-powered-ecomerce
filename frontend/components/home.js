'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
    const [products, setProducts] = useState([]);
    const [recommandedProducts, setRecommandedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const {user} = useAuth();
    // console.log(user)

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


    useEffect(() => {
        if (user){
            const fetchRecommandedProducts = async () => {
                try {
                    const response = await fetch(`${API_URL}/products/recommended`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    });
                    const recommanded_products_ids = (await response.json())['recommanded_products_ids'];
                    // console.log(recommanded_products_ids)
                    const myRecommandedProducts = await Promise.all(recommanded_products_ids.map(async (id) => {
                        const productResponse = await fetch(`${API_URL}/products/${id}`, {
                        method: 'GET',
                        headers: {'Accept': 'application/json',},
                        });
                        const productJson = await productResponse.json();
                        return productJson;
                    }))
                    // console.log(myRecommandedProducts)
                    setRecommandedProducts(myRecommandedProducts);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching products:', error);
                    setLoading(false);
                }
            };
            fetchRecommandedProducts();
        }
    }, [user]);

    const handleProductClick = (productId) => {
        router.push(`/product/${productId}`);
    };

    if (!products) return null;
    return (
        <div className={styles.pageWrapper}>
            <main>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                <h1>Welcome to Smartomarket</h1>
                <p>Discover the future of shopping with AI-powered recommendations</p>
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
                <><div className={styles.productsGrid}>
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
                    {/* Recommanded for you section */}
                    {user ? (
                        <>
                        <div className={styles.sectionHeader}>
                            <h2>Recommanded For You</h2>
                            <p>Discover Your Favorate Recommandations</p>
                        </div>
                        <div className={styles.productsGrid}>
                            {recommandedProducts.map((product) => (
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
                        </>
                    ) : (
                    null
                    )}
                    </>
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
