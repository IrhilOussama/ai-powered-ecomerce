import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaSearch, FaShoppingCart, FaUser, FaTimes, 
         FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, 
         FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGooglePlay } from 'react-icons/fa';
import styles from '../styles/Layout.module.css';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        {/* <div className={styles.topBar}>
          <div className={styles.container}>
            <div className={styles.topBarLeft}>
              <select className={styles.currencySelect}>
                <option>USD</option>
                <option>EUR</option>
              </select>
              <select className={styles.languageSelect}>
                <option>English</option>
                <option>Français</option>
              </select>
            </div>
            <div className={styles.topBarRight}>
              <Link href="#" className={styles.topBarLink}>Track Order</Link>
              <Link href="#" className={styles.topBarLink}>Shipping</Link>
              <Link href="#" className={styles.topBarLink}>Help</Link>
            </div>
          </div>
        </div> */}

        <div className={styles.mainHeader}>
          <div className={styles.container}>

            <div className={styles.Header1}>
              <Link href="/" className={styles.logo}>
                <h1>STORE</h1>
              </Link>

              <div className={styles.headerActions}>
                <button onClick={() => router.push("/account")} className={styles.actionButton}>
                  <FaUser />
                  <span>Account</span>
                </button>
                <button onClick={() => router.push("/cart")} className={styles.actionButton}>
                  <div className={styles.cartWrapper}>
                    <FaShoppingCart />
                    <span className={styles.cartCount}>0</span>
                  </div>
                  <span>Cart</span>
                </button>
              </div>
            </div>

                        
            <div className={styles.searchRow}>
              <div className={styles.searchWrapper}>
                <select className={styles.categorySelect}>
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                </select>
                <div className={styles.searchInputWrapper}>
                  <input 
                    type="text" 
                    placeholder="Search for products..." 
                    className={styles.searchInput}
                  />
                  <button className={styles.searchButton}>
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <nav className={styles.mainNav}>
          <div className={styles.container}>
            <button 
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
              <ul>
                <li><Link href="/" className={styles.active}>Home</Link></li>
                <li><Link href="#">New Arrivals</Link></li>
                <li><Link href="#">Trending</Link></li>
                <li><Link href="#">Deals</Link></li>
                <li><Link href="#">Brands</Link></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.newsletterSection}>
          <div className={styles.container}>
            <div className={styles.newsletterContent}>
              <div className={styles.newsletterText}>
                <h3>Subscribe to our Newsletter</h3>
                <p>Get the latest updates, deals and exclusive offers directly to your inbox.</p>
              </div>
              <form className={styles.newsletterForm}>
                <div className={styles.inputGroup}>
                  <input type="email" placeholder="Enter your email address" />
                  <button type="submit">Subscribe</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className={styles.mainFooter}>
          <div className={styles.container}>
            <div className={styles.footerGrid}>
              <div className={styles.footerColumn}>
                <div className={styles.footerLogo}>
                  <h2>STORE</h2>
                </div>
                <p className={styles.companyDesc}>
                  Your trusted destination for quality products and exceptional shopping experience since 2010.
                </p>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <FaMapMarkerAlt />
                    <span>123 Store Street, City, Country</span>
                  </div>
                  <div className={styles.contactItem}>
                    <FaPhone />
                    <span>+1 234 567 890</span>
                  </div>
                  <div className={styles.contactItem}>
                    <FaEnvelope />
                    <span>contact@yourstore.com</span>
                  </div>
                </div>
              </div>

              <div className={styles.footerColumn}>
                <h3>Quick Links</h3>
                <ul className={styles.footerLinks}>
                  <li><Link href="#">About Us</Link></li>
                  <li><Link href="#">Contact Us</Link></li>
                  <li><Link href="#">Products</Link></li>
                  <li><Link href="#">Login</Link></li>
                  <li><Link href="#">Sign Up</Link></li>
                </ul>
              </div>

              <div className={styles.footerColumn}>
                <h3>Customer Service</h3>
                <ul className={styles.footerLinks}>
                  <li><Link href="#">Shipping Policy</Link></li>
                  <li><Link href="#">Returns & Exchanges</Link></li>
                  <li><Link href="#">FAQs</Link></li>
                  <li><Link href="#">Track Order</Link></li>
                  <li><Link href="#">Privacy Policy</Link></li>
                </ul>
              </div>

              <div className={styles.footerColumn}>
                <h3>Download Our App</h3>
                <p className={styles.appText}>Shop on the go with our mobile app.</p>
                <div className={styles.appButtons}>
                  <Link href="#" className={styles.customAppButton}>
                    <FaGooglePlay className={styles.playIcon} />
                    <div className={styles.buttonText}>
                      <span className={styles.getIt}>GET IT ON</span>
                      <span className={styles.storeName}>Google Play</span>
                    </div>
                  </Link>
                </div>
                <div className={styles.socialLinks}>
                  <Link href="#" className={styles.socialLink}><FaFacebookF /></Link>
                  <Link href="#" className={styles.socialLink}><FaTwitter /></Link>
                  <Link href="#" className={styles.socialLink}><FaInstagram /></Link>
                  <Link href="#" className={styles.socialLink}><FaLinkedinIn /></Link>
                  <Link href="#" className={styles.socialLink}><FaYoutube /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.subFooter}>
          <div className={styles.container}>
            <div className={styles.subFooterContent}>
              <p>&copy; 2024 Your Store. All rights reserved.</p>
              <div className={styles.paymentMethods}>
                <img src="/visa.png" alt="Visa" />
                <img src="/mastercard.png" alt="Mastercard" />
                <img src="/paypal.png" alt="PayPal" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 