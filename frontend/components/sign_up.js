
import styles from "@/styles/Login.module.css";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/utils/api";
export default function Sign_Up_Page({setLogin}) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {login} = useAuth();
    const [errorMsg, setErrorMsg] = useState();
 
    const onSubmit = async (data) => {
      try {
        const response = await axios.post(`${API_URL}/users`, data);
        const token = response.data.token;
        const userData = response.data.user;
        console.log(response);
        login(token, userData);
        // Handle successful registration (e.g., redirect to another page)
      } catch (error) {
        setErrorMsg("email already exist")
        console.log(error);
        // Handle registration error
      }
    }
    return (
    <div className={styles.container}>
        <div className={styles.formWrapper}>
        <h2 className={styles.title}>Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
            {errors.name && <p className={styles.errorMessage}>{errors.name.message}</p>}
            <label htmlFor="name">Name</label>
            <input
                id="username"
                type="text"
                {...register("username", { required: "Name is required" })}
                className={errors.name ? styles.inputError : ""}
            />
            {errors.name && <p className={styles.errorMessage}>{errors.name.message}</p>}
            </div>
            <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className={errors.email ? styles.inputError : ""}
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
            <button type="submit" className={styles.submitButton}>Sign Up</button>
            <p>
              have already an account, <span className={styles.switchBtn} onClick={() => setLogin(true)} >Login</span>
            </p>
        </form>
        </div>
    </div>
    )
}

