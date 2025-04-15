"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import EditAccountPage from "@/components/accountEdit";
import Log_In_Page from "@/components/log_in";


export default function Account() {
  const {user} = useAuth();
  if (!user) {
    return <div>Loading user data...</div>;
  }
  return (
    <>
      {user? (
        <EditAccountPage/>
      ): (
        <Log_In_Page/>
      )}
    </>
  )
};
