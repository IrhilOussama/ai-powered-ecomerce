
import styles from "@/styles/Login.module.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { API_URL } from "@/utils/api";
export default function Log_In_Page({setLogin}) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMsg, setErrorMsg] = useState();
    const {login} = useAuth();

    const onSubmit = async (data) => {
      try {
        const response = await axios.post("http://localhost:8000/api/users/login", data);
        const token = response.data.token;
        const userData = response.data.user;
        login(token, userData);
        // Handle successful registration (e.g., redirect to another page)
      } catch (error) {
        setErrorMsg("Invalid email or password")
        console.log(error);
        // Handle registration error

      }
    };
    const handleGoogleClick = async () => {
      window.location.assign(`${API_URL}/auth/google`)
    }
    return (
    <div className={styles.container}>
        <div className={styles.formWrapper}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
            {errors.name && <p className={styles.errorMessage}>{errors.name.message}</p>}
            </div>
            <div className={styles.formGroup}>
            {errorMsg && <span className={styles.errorMsg}>{errorMsg}</span>}
            <label htmlFor="email">Email</label>
            <input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className={errors.email ? styles.inputError : ""}
                onError={ () => errorMsg}
            />
            {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
            </div>
            <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                className={errors.password ? styles.inputError : ""}
            />
            {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
            </div>
            <button type="submit" className={styles.submitButton}>Login</button>
            <p>
                don't have an account, <span className={styles.switchBtn} onClick={() => setLogin(false)}>Sign Up</span>
            </p>
        </form>
        <button className={styles.googleButton} onClick={handleGoogleClick}>
          <img src="/google-logo.svg" alt="Google Logo" className={styles.icon} />
          Sign in with Google
        </button>
        </div>
    </div>
    )
}

