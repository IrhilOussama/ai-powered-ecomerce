import React from "react";
import styles from "../styles/Cart.module.css";

const CartPage = () => {
  const cartItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 59.99,
      quantity: 2,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 99.99,
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: 29.99,
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
  ];

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Cart</h1>

      {/* Cart Items Section */}
      <div className={styles.cartItems}>
        {cartItems.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <img src={item.image} alt={item.name} className={styles.itemImage} />
            <div className={styles.itemDetails}>
              <h2 className={styles.itemName}>{item.name}</h2>
              <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
              <p className={styles.itemQuantity}>Quantity: {item.quantity}</p>
            </div>
            <button className={styles.removeButton}>Remove</button>
          </div>
        ))}
      </div>

      {/* Cart Summary Section */}
      <div className={styles.summary}>
        <h2 className={styles.summaryTitle}>Order Summary</h2>
        <p className={styles.total}>
          Total: <span>${calculateTotal()}</span>
        </p>
        <div className={styles.actions}>
          <button className={styles.updateButton}>Update Cart</button>
          <button className={styles.checkoutButton}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
