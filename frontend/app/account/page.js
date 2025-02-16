"use client";
import React, { useEffect, useState } from "react";
import LoginPage from "@/components/login";
import { useAuth } from "@/context/AuthContext";
import AccountPage from "@/components/account";
import styles from "@/styles/Product.module.css";


export default function Account() {
  let {user} = useAuth();
  if (user === undefined) return <div className={styles.loader}><div></div><div></div><div></div></div>;
  else if (user === null) return <LoginPage/>;
  else return <AccountPage />
};
