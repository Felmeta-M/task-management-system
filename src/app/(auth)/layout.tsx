import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { QueryProvider } from "@/providers/query-providers";
import { Toaster } from "@/components/ui/sonner";
// import { useAuthStore } from "@/stores/auth-store";
// import { validateRequest } from "@/lib/auth-utils";
// import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Login To Task Management System",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { isAuthenticated, logout } = useAuthStore();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const { user } = await validateRequest();
  //     if (!user && isAuthenticated) logout();
  //   };
  //   checkAuth();
  // }, [isAuthenticated, logout]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
