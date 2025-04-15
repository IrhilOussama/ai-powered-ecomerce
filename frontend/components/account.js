"use client";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {UserProfileCard} from "@/components/ui/user/UserProfileCard";
import {SecuritySection} from "@/components/ui/user/SecuritySection";
import {PreferencesSection} from "@/components/ui/user/PreferencesSection";
import {UserStats} from "@/components/ui/user/UserStats";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api_endpoints";


export default function AccountPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userStats, setUserStats] = useState({
    purchasedProducts: 0,
    favoriteCategory: "None",
    memberSince: "",
    reviews: 0
  });
  const [preferences, setPreferences] = useState({
    darkMode: theme === "dark",
    emailNotifications: true,
    language: "English"
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    const fetchUser = async () => {
      const response = await axios.get(`${API_ENDPOINTS.USER.BASE}/${user.id}`);
      if (response.status >= 200 && response.status < 300){
        const data = response.data
        setUserStats(
          {
            purchasedProducts: data["purchases_number"],
            favoriteCategory: data["favorite_category"] ? data["favorite_category"] : "Clothes",
            memberSince: data["register_date"],
            reviews: 0
          }
        )
      }
    }
    fetchUser();
  }, [user.id]);

  useEffect(() => {
    setTheme(preferences.darkMode ? "dark" : "light");
  }, [preferences.darkMode, setTheme]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const changeLanguage = () => {
    const languages = ["English", "French", "Spanish", "German"];
    const currentIndex = languages.indexOf(preferences.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setPreferences(prev => ({
      ...prev,
      language: languages[nextIndex]
    }));
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
  
    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("New password must be different from the current one.");
      return;
    }
  
    try {
      setIsChangingPassword(true);
      const token = localStorage.getItem("token");
  
      const response = await axios.post(
        `${API_ENDPOINTS.USER.BASE}/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setShowPasswordChange(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
        });
      }
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error("Password change failed.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            Your Account
          </h1>
          <p className="text-muted-foreground">
            Manage your profile and settings
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background rounded-xl shadow-sm border overflow-hidden"
        >
          <UserProfileCard 
            user={user} 
            isLoading={isLoading} 
            handleLogout={handleLogout} 
            isLoggingOut={isLoggingOut} 
          />
          <UserStats userStats={userStats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid gap-6 md:grid-cols-2"
        >
          <PreferencesSection 
            preferences={preferences} 
            togglePreference={togglePreference} 
            changeLanguage={changeLanguage} 
          />
          
          <SecuritySection
            showPasswordChange={showPasswordChange}
            setShowPasswordChange={setShowPasswordChange}
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            handlePasswordChange={handlePasswordChange}
            isChangingPassword={isChangingPassword}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}