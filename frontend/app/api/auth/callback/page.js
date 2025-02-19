"use client"
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '@/styles/Product.module.css';
import { useAuth } from '@/context/AuthContext';
import { Suspense } from 'react';

export default function googleCallback(){
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackComponent />
    </Suspense>
  );
}


export function GoogleCallbackComponent(){
  const [token, setToken] = useState();
  const searchParams = useSearchParams();
  const {user, login} = useAuth();
  useEffect(() => {
    const tokenValue = searchParams.get("token");
    setToken(tokenValue)
  }, [searchParams])
  if (token && !user){
    login(token);
  }

  return (
      <div className={styles.loader}><div></div><div></div><div></div></div>
  );
}
