import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import CookieBanner from '@/components/CookieBanner';


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MySubs Tracker",
  description: "Track all your subscriptions",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body>{children}<Toaster /><CookieBanner /></body>
      </html>
  )
}
