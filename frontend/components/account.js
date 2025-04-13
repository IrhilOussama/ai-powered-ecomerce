import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "../styles/Account.module.css";

export default function AccountPage() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Account</h1>
      
      <div className={styles.profileSection}>
        <div className={styles.avatar}>
          {user.name?.charAt(0) || user.email?.charAt(0)}
        </div>
        
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{user.username || "Anonymous"}</h2>
          <p className={styles.userEmail}>{user.email}</p>
          <p className={styles.userId}>User ID: {user.id}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/account/edit" className={styles.editButton}>
          Edit Profile
        </Link>
        <Link onClick={logout} href="/account" className={styles.logoutButton}>
          Logout
        </Link>
      </div>
    </div>
  );
}