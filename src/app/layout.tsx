import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";
import { GoogleTagManager} from "@next/third-parties/google";

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
        <GoogleTagManager gtmId="GTM-KN93RKTH" />
      </html>
      <body className={inter.className} >
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KN93RKTH"
            height="0" width="0" style={{display:"none" , visibility:"hidden"}}>
            </iframe>
        </noscript>
        <AuthProvider>
        
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
