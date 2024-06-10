import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";
import GoogleTagManager from "@/components/custom/GoogleTagManager";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo By ABD",
  description: "Todo with firebase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <html>
        <GoogleTagManager/>
      </html>
      <body className={inter.className} >
        <AuthProvider>
          {children}
          <Toaster position="top-right"/>
        </AuthProvider>
      </body>
    </html>
  );
}
