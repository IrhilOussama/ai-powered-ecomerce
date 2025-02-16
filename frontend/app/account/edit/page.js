"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import EditAccountPage from "@/components/accountEdit";


export default function Account() {
  const {user} = useAuth();
  return (
    <>
      {user? (
        <EditAccountPage/>
      ): (
        <EditAccountPage/>
      )}
    </>
  )
};
