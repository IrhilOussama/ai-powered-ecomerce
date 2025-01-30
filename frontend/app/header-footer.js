"use client";
import Link from 'next/link';
import { useState } from 'react';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmazonPay, FaGooglePlay, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import styles from '../styles/Layout.module.css';
import { useRouter } from 'next/navigation';

export default function HeaderFooter ({children}){
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
        router.push(`/search?q=${searchQuery}`);
      } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="po68qYj20e7v7O_OwNOPiXqiLtLQHq0DBxUbGlpBScU" />

      </head>
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body>
        <>
          <div className={styles.pageWrapper}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.topBar}>
                <div className={styles.logoSection}>
                  <Link href="/">
                    <div className={styles.logo}>SmartoMarket</div>
                  </Link>
                </div>
                <div className={styles.headerIcons}>
                  <Link href="/cart">
                    <div className={styles.headerIcon}>
                      <FaShoppingCart />
                    </div>
                  </Link>
                  <Link href="/account">
                    <div className={styles.headerIcon}>
                      <FaUser />
                    </div>
                  </Link>
                  <button 
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    {isMenuOpen ? <FaArrowUp /> : <FaArrowDown />}
                  </button>
                </div>
              </div>
              
              <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
                <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  <button type="submit" disabled={isSearching}>
                    <FaSearch className={styles.searchIcon} />
                  </button>
                </form>
              </nav>
            </div>
          </header>

          <main className={styles.main}>
            {children}
          </main>

          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              {/* About Section */}
              <div className={styles.footerSection}>
                <h3>Smartomarket</h3>
                <p>Welecome to smartomarket, place where you find modern new brand clothes with perfect prices, don't miss the chance to look great today and see latest clothes in your smart market</p>
                <div className={styles.socialLinks}>
                  <a href="#" aria-label="Facebook">
                    <FaFacebook />
                  </a>
                  <a href="#" aria-label="Twitter">
                    <FaTwitter />
                  </a>
                  <a href="#" aria-label="Instagram">
                    <FaInstagram />
                  </a>
                  <a href="#" aria-label="LinkedIn">
                    <FaLinkedin />
                  </a>
                </div>
                <a href="#" className={styles.playStoreButton}>
                  <FaGooglePlay className={styles.playStoreIcon} />
                  <div className={styles.playStoreText}>
                    <span className={styles.getItOn}>GET IT ON</span>
                    <span className={styles.googlePlay}>Google Play</span>
                  </div>
                </a>
              </div>

              {/* Quick Links Section */}
              <div className={styles.footerSection}>
                <h3>Quick Links</h3>
                <div className={styles.footerLinks}>
                  <Link href="/products">All Products</Link>
                  <Link href="/categories">Categories</Link>
                  <Link href="/deals">Deals</Link>
                  <Link href="/new-arrivals">New Arrivals</Link>
                  <Link href="/popular">Popular Items</Link>
                </div>
              </div>

              {/* Customer Service Section */}
              <div className={styles.footerSection}>
                <h3>Customer Service</h3>
                <div className={styles.footerLinks}>
                  <Link href="/contact">Contact Us</Link>
                  <Link href="/shipping">Shipping Info</Link>
                  <Link href="/returns">Returns</Link>
                  <Link href="/faq">FAQ</Link>
                  <Link href="/privacy">Privacy Policy</Link>
                </div>
              </div>

              {/* Newsletter Section */}
              <div className={styles.footerSection}>
                <h3>Stay Updated</h3>
                <p>Subscribe to our newsletter for the latest products and deals</p>
                <div className={styles.newsletter}>
                  <form className={styles.newsletterForm}>
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      aria-label="Email for newsletter"
                    />
                    <button type="submit" aria-label="Subscribe">
                      <FaPaperPlane />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.footerBottom}>
              <div className={styles.footerBottomContent}>
                <p>&copy; 2024 AI Shop. All rights reserved.</p>
                <div className={styles.paymentMethods}>
                  <FaCcVisa />
                  <FaCcMastercard />
                  <FaCcPaypal />
                  <FaCcAmazonPay />
                </div>
              </div>
            </div>
          </footer>
        </div>
        </>
      </body>
    </html>
  );
}