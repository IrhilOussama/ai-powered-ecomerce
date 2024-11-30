import React from "react";
import styles from "../styles/Account.module.css";
import { FaUser, FaEdit, FaKey, FaSignOutAlt, FaHistory, FaBox } from "react-icons/fa";

const AccountPage = () => {
  const user = {
    name: "Oussama",
    email: "oussama@example.com",
    avatar: "https://via.placeholder.com/120",
    membership: "Gold Member",
  };

  const orderHistory = [
    { 
      id: "12345", 
      date: "2024-11-20", 
      status: "Delivered", 
      total: "$120.00",
      items: 3
    },
    { 
      id: "12346", 
      date: "2024-11-15", 
      status: "In Transit", 
      total: "$89.99",
      items: 2
    },
    { 
      id: "12347", 
      date: "2024-11-10", 
      status: "Cancelled", 
      total: "$45.50",
      items: 1
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#10B981'; // Green
      case 'in transit':
        return '#3B82F6'; // Blue
      case 'cancelled':
        return '#EF4444'; // Red
      default:
        return '#6B7280'; // Gray
    }
  };

  return (
    <div className={styles.container}>
      {/* Profile Section */}
      <div className={styles.profileSection}>
        <img 
          className={styles.avatar} 
          src={user.avatar} 
          alt={`${user.name}'s avatar`}
        />
        <div className={styles.profileDetails}>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.email}>{user.email}</p>
          <div className={styles.membership}>{user.membership}</div>
        </div>
      </div>

      {/* Order History Section */}
      <div className={styles.orderHistorySection}>
        <h2 className={styles.sectionTitle}>
          <FaHistory />
          Order History
        </h2>
        <div className={styles.tableWrapper}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.items} items</td>
                  <td>
                    <span 
                      style={{ 
                        color: getStatusColor(order.status),
                        fontWeight: 500
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>
          <FaUser />
          Account Settings
        </h2>
        <div className={styles.settingsOptions}>
          <button className={styles.settingsButton}>
            <FaEdit />
            Edit Profile
          </button>
          <button className={styles.settingsButton}>
            <FaKey />
            Change Password
          </button>
          <button className={styles.settingsButton}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
