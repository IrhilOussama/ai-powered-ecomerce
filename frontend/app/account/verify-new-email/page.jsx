"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api_endpoints";
import { toast } from "sonner";

export default function VerifyNewEmailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const authToken = localStorage.getItem("token");
        if (!authToken) {
          throw new Error("No authentication token found");
        }

        const response = await axios.post(
          `${API_ENDPOINTS.USER.BASE}/confirm-email-change`,
          { token },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 200) {
          setStatus("success");
        //   user?.email = 
          toast.success("Email address updated successfully!");
          
          // Start countdown for redirect
          const timer = setInterval(() => {
            setCountdown(prev => {
              const newCount = prev - 1;
              if (newCount <= 0) {
                clearInterval(timer);
                router.push("/account");
                return 0;
              }
              return newCount;
            });
          }, 1000);

          return () => clearInterval(timer);
        } else {
          throw new Error(response.data.message || "Email verification failed");
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
        toast.error(error.response?.data?.message || "Failed to verify email address");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="bg-background p-8 rounded-xl border shadow-sm max-w-md w-full text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
            <h2 className="text-2xl font-bold">Verifying your email</h2>
            <p className="text-muted-foreground">
              Please wait while we verify your new email address...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
            <h2 className="text-2xl font-bold">Email Verified Successfully!</h2>
            <p className="text-muted-foreground">
              Your email address has been updated. {countdown > 0 && (
                <>You'll be redirected in {countdown} second{countdown !== 1 ? 's' : ''}.</>
              )}
            </p>
            <Button onClick={() => router.push("/account")} className="mt-4">
              Go to Account Now
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-2xl font-bold">Verification Failed</h2>
            <p className="text-muted-foreground">
              The email verification link is invalid or has expired.
            </p>
            <div className="flex gap-2 justify-center mt-4">
              <Button variant="outline" onClick={() => router.push("/account")}>
                Back to Account
              </Button>
              <Button onClick={() => router.push("/account/edit")}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}