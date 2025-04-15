"use client";
import { motion } from "framer-motion";
import { User, Mail, KeyRound, Edit } from "lucide-react";
import { LoadingSkeleton } from "@/components/loadingSkeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function UserProfileCard({ user, isLoading, handleLogout, isLoggingOut }){
  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {isLoading ? (
              <LoadingSkeleton className="w-full h-full rounded-full" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 
              user?.email?.charAt(0).toUpperCase() || 
              "A"
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute -bottom-2 -right-2 bg-background p-2 rounded-full shadow border"
          >
            <Edit className="h-4 w-4 text-primary" />
          </motion.div>
        </motion.div>

        <div className="flex-1 text-center md:text-left space-y-2">
          {isLoading ? (
            <>
              <LoadingSkeleton className="h-8 w-3/4 mx-auto md:mx-0 mb-2" />
              <LoadingSkeleton className="h-5 w-1/2 mx-auto md:mx-0" />
              <LoadingSkeleton className="h-5 w-2/3 mx-auto md:mx-0" />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">
                {user?.username || "Anonymous"}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <p>{user?.email}</p>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground text-sm">
                <KeyRound className="h-3 w-3" />
                <p>ID: {user?.id}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Button
          asChild
          variant="outline"
          className="gap-2 py-6 sm:py-4 rounded-lg transition-all hover:bg-primary/10 hover:border-primary"
        >
          <Link href="/account/edit">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Link>
        </Button>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="gap-2 py-6 sm:py-4 rounded-lg transition-all hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
              Logging out...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </div>
          )}
        </Button>
      </motion.div>
    </div>
  );
};