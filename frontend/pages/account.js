import React from "react";
import styles from "../styles/Account.module.css";

const AccountPage = () => {
  const user = {
    name: "Oussama",
    email: "oussama@example.com",
    avatar: "https://via.placeholder.com/100",
    membership: "Gold Member",
  };

  const orderHistory = [
    { id: "12345", date: "2024-11-20", status: "Delivered", total: "$120.00" },
    { id: "12346", date: "2024-11-15", status: "In Transit", total: "$89.99" },
    { id: "12347", date: "2024-11-10", status: "Cancelled", total: "$45.50" },
  ];

  return (
    <div className={styles.container}>
      {/* Profile Information Section */}
      <div className={styles.profileSection}>
        <img className={styles.avatar} src={user.avatar} alt="User Avatar" />
        <div className={styles.profileDetails}>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.email}>{user.email}</p>
          <p className={styles.membership}>{user.membership}</p>
        </div>
      </div>

      {/* Order History Section */}
      <div className={styles.orderHistorySection}>
        <h2 className={styles.sectionTitle}>Order History</h2>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.status}</td>
                <td>{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Account Settings Section */}
      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>Account Settings</h2>
        <div className={styles.settingsOptions}>
          <button className={styles.settingsButton}>Edit Profile</button>
          <button className={styles.settingsButton}>Change Password</button>
          <button className={styles.settingsButton}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
