"use client";
import { User } from "lucide-react";
import { motion } from "framer-motion";

export const PreferencesSection = ({ preferences, togglePreference, changeLanguage }) => {
  return (
    <div className="bg-background p-6 rounded-xl border shadow-sm">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        Preferences
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Dark Mode</span>
          <button 
            onClick={() => togglePreference("darkMode")}
            className={`w-10 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${preferences.darkMode ? 'bg-primary' : 'bg-muted'}`}
          >
            <motion.div
              className="w-5 h-5 bg-background rounded-full shadow"
              animate={{ x: preferences.darkMode ? 18 : -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </button>
        </div>
        {/* <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Email Notifications</span>
          <button 
            onClick={() => togglePreference("emailNotifications")}
            className={`w-10 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${preferences.emailNotifications ? 'bg-primary' : 'bg-muted'}`}
          >
            <motion.div
              className="w-5 h-5 bg-background rounded-full shadow"
              animate={{ x: preferences.emailNotifications ? 18 : -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Language</span>
          <button 
            onClick={changeLanguage}
            className="font-medium hover:text-primary transition-colors"
          >
            {preferences.language}
          </button>
        </div> */}
      </div>
    </div>
  );
};