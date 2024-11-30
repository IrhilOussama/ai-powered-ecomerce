import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/Cart.module.css";
import { 
  FaShoppingCart, 
  FaMinus, 
  FaPlus, 
  FaTrash, 
  FaSync, 
  FaCreditCard,
  FaShoppingBasket,
  FaArrowRight
} from "react-icons/fa";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 59.99,
      quantity: 2,
      image: "https://via.placeholder.com/200",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 99.99,
      quantity: 1,
      image: "https://via.placeholder.com/200",
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: 29.99,
      quantity: 1,
      image: "https://via.placeholder.com/200",
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateTax = () => calculateSubtotal() * 0.1; // 10% tax
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <FaShoppingBasket className={styles.emptyCartIcon} />
          <h2 className={styles.emptyCartText}>Your cart is empty</h2>
          <Link href="/" className={styles.continueShoppingButton}>
            <FaArrowRight /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <FaShoppingCart /> Shopping Cart
      </h1>

      <div className={styles.cartLayout}>
        {/* Cart Items Section */}
        <div className={styles.cartItems}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <img 
                src={item.image} 
                alt={item.name} 
                className={styles.itemImage} 
              />
              <div className={styles.itemDetails}>
                <h2 className={styles.itemName}>{item.name}</h2>
                <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                <div className={styles.itemQuantity}>
                  <button 
                    className={styles.quantityButton}
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <FaMinus />
                  </button>
                  <span className={styles.quantityValue}>{item.quantity}</span>
                  <button 
                    className={styles.quantityButton}
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <button 
                className={styles.removeButton}
                onClick={() => removeItem(item.id)}
              >
                <FaTrash /> Remove
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary Section */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>
            <FaShoppingCart /> Order Summary
          </h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax (10%)</span>
            <span>${calculateTax().toFixed(2)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <div className={styles.actions}>
            <button className={styles.updateButton}>
              <FaSync /> Update Cart
            </button>
            <button className={styles.checkoutButton}>
              <FaCreditCard /> Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
