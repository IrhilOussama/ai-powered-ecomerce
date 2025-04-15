"use client";
import { KeyRound, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/api_endpoints";

export const SecuritySection = ({
  showPasswordChange,
  setShowPasswordChange,
  passwordData,
  setPasswordData,
  handlePasswordChange,
  isChangingPassword,
}) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async () => {
    setIsSendingReset(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_ENDPOINTS.USER.BASE}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success("We've sent a password reset link to your email address.");
        setShowForgotPassword(false);
      } else {
        throw new Error('Failed to send reset email');
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="bg-background p-6 rounded-xl border shadow-sm">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-primary" />
        Security
      </h3>
      <div className="space-y-4">
        <div>
          <p className="text-muted-foreground text-sm">Password</p>
          <p className="font-medium">••••••••</p>
        </div>

        {showPasswordChange ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Current Password</label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value
                })}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">New Password</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value
                })}
                placeholder="Enter new password"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="gap-2"
              >
                {isChangingPassword ? (
                  <>
                    <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Confirm Change"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPasswordChange(false)}
                disabled={isChangingPassword}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowPasswordChange(true)}
            >
              Change Password
            </Button>
            <button 
              className="text-sm text-primary hover:underline"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot password?
            </button>
          </div>
        )}

        {showForgotPassword && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-0.5 text-primary" />
              <div className="space-y-3">
                <h4 className="font-medium">Reset your password</h4>
                <p className="text-sm text-muted-foreground">
                  We'll send you a link to reset your password. This link will expire in 15 minutes.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleForgotPassword}
                    disabled={isSendingReset}
                    size="sm"
                    className="gap-2"
                  >
                    {isSendingReset ? (
                      <>
                        <div className="h-3 w-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowForgotPassword(false)}
                    disabled={isSendingReset}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Last changed: 3 months ago</span>
        </div>
      </div>
    </div>
  );
};