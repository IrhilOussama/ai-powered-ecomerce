import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/AccountEdit.module.css";

export default function EditAccountPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  console.log(user);
  const [formData, setFormData] = useState({
    name: user.username || "",
    email: user.email || ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      router.push("/account");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className={styles.editContainer}>
      <h1 className={styles.editTitle}>Edit Profile</h1>
      
      <form onSubmit={handleSubmit} className={styles.editForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => router.push("/account")}
          >
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}