"use client"
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '@/styles/Product.module.css';
import { useAuth } from '@/context/AuthContext';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

export default function googleCallback(){
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackComponent />
    </Suspense>
  );
}


function GoogleCallbackComponent(){
  const [token, setToken] = useState();
  const searchParams = useSearchParams();
  const {user, login} = useAuth();
  const router = useRouter();
  useEffect(() => {
    const tokenValue = searchParams.get("token");
    setToken(tokenValue)
  }, [searchParams])
  if (token && !user){
    login(token);
    router.push("/account")
  }

  return (
      <div className={styles.loader}><div></div><div></div><div></div></div>
  );
}
