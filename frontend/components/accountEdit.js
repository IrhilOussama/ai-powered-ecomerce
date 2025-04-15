"use client";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, User, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api_endpoints";
import { LoadingSkeleton } from "@/components/loadingSkeleton";
import { useState } from "react";

export default function EditAccountPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.USER.BASE}/${user.id}`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      user.username = response.data.user.username;
      toast.success("Username updated successfully");
      router.push("/account");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update username");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async () => {
    if (!email.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    if (email === user.email) {
      toast.error("New email must be different from current email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsEmailLoading(true);
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.USER.BASE}/change-email-request`,
        { newEmail: email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Verification link sent to your new email address");
        setIsEmailChanged(true);
      }
    } catch (error) {
      console.error("Email change failed:", error);
      toast.error(error.response?.data?.message || "Failed to initiate email change");
    } finally {
      setIsEmailLoading(false);
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
          className="mb-8 flex items-center gap-4"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/account")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Edit Profile
            </h1>
            <p className="text-muted-foreground">
              Update your account information
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background p-6 rounded-xl border shadow-sm space-y-8"
        >
          {!user ? (
            <LoadingSkeleton />
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Username</label>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading || username === user.username}
                      className="gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Address
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Current Email</label>
                    <Input
                      type="text"
                      value={user.email}
                      disabled
                      className="opacity-70"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">New Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter new email address"
                      disabled={isEmailChanged}
                    />
                  </div>
                  {isEmailChanged ? (
                    <div className="p-4 bg-muted/50 rounded-lg text-sm">
                      <p className="text-muted-foreground">
                        We have sent a verification link to <span className="font-medium">{email}</span>.
                        Please check your inbox and click the link to confirm your new email address.
                      </p>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        onClick={handleEmailChange}
                        disabled={isEmailLoading || !email || email === user.email}
                        className="gap-2"
                      >
                        {isEmailLoading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Verification Link"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}