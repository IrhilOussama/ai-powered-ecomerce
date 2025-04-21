"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api_endpoints";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setError("");
        
        try {
            const response = await fetch(`${API_ENDPOINTS.USER.BASE}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                setSuccess(true);
            } else {
                const data = await response.json();
                throw new Error(data.message || "Failed to send reset email");
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        Forgot Password
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        {success 
                            ? "Check your email for the reset link"
                            : "Enter your email to receive a password reset link"}
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-md text-sm">
                                We have sent a password reset link to your email address.
                            </div>
                            <Link href="/login" className="text-sm text-primary hover:underline">
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : "Send Reset Link"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}