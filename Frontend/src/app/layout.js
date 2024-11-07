import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import CookieBanner from '@/components/CookieBanner';


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "My Subs ⋅ Track your subscriptions",
    description: "Personal Project of Alejandro Griffith",
    icons: {
        icon: [
            {rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png"},
            {rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png"},
            {rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png"},
            {rel: "shortcut icon", url: "/favicon.ico"},
        ],
        manifest: "/site.webmanifest",
        maskIcon: {rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5"},
    },
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body>{children}<Toaster /></body>
      </html>
  )
}

