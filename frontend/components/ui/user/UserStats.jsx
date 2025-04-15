"use client";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star, Calendar } from "lucide-react";

export const UserStats = ({ userStats }) => {
  const statsItems = [
    { 
      label: "Purchased", 
      value: userStats.purchasedProducts,
      icon: <ShoppingBag className="h-5 w-5 text-primary mx-auto mb-1" />
    },
    { 
      label: "Favorite Category", 
      value: userStats.favoriteCategory,
      icon: <Heart className="h-5 w-5 text-primary mx-auto mb-1" />
    },
    { 
      label: "Reviews", 
      value: userStats.reviews,
      icon: <Star className="h-5 w-5 text-primary mx-auto mb-1" />
    },
    { 
      label: "Member Since", 
      value: userStats.memberSince,
      icon: <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="border-t bg-muted/10 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0"
    >
      {statsItems.map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.03 }}
          className="p-4 text-center"
        >
          {stat.icon}
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className="font-semibold text-lg">{stat.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};