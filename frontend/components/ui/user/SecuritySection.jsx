"use client";
import { KeyRound, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/lib/api_endpoints";

export const SecuritySection = ({
  showPasswordChange,
  setShowPasswordChange,
  passwordData,
  setPasswordData,
  handlePasswordChange,
  isChangingPassword,
}) => {


  

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