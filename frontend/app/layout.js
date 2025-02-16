import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderFooter from "./header-footer";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "smartomarket",
  description: "Welcome to Smartomarket! Discover modern, brand-new clothes at perfect prices. Shop the latest fashion trends and look great today at your smart market",
};

export default function RootLayout({ children }) {
  return(
    <AuthProvider>
      <HeaderFooter children={children}/>
    </AuthProvider>
  ) 
}



 