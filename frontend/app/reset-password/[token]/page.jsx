"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api_endpoints";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
        toast.error("Passwords don't match")
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.USER.BASE}/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ newPassword: password }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Your password has been reset successfully")
        setTimeout(() => router.push("/account"), 2000);
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      toast.error(error.message || "Failed to reset password")
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h2 className="text-2xl font-bold">Password Reset Successful</h2>
        <p className="text-muted-foreground">You'll be redirected to login shortly...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 min-h-[60vh] flex flex-col justify-center">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
        <p className="text-muted-foreground">
          Enter your new password below
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">New Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            minLength={8}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm Password</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            minLength={8}
          />
        </div>
        <Button type="submit" className="w-full gap-2" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Reset Password
        </Button>
      </form>
    </div>
  );
}