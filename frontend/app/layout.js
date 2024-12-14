import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderFooter from "./header-footer";

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
  description: "Welecome to smartomarket, place where you find modern new brand clothes with perfect prices, don't miss the chance to look great today and see latest clothes in your smart market",
};

export default function RootLayout({ children }) {
  return <HeaderFooter children={children}/>
}



 