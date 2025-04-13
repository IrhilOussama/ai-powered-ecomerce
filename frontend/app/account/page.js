"use client";
import { useAuth } from "@/context/AuthContext";
import LoginPage from "@/components/login";
import AccountPage from "@/components/account";
import styles from "@/styles/Product.module.css";

export default function Account() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <AccountPage />;
}