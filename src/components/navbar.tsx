"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { logoutUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
// import { useEffect } from "react";
// import { validateRequest } from "@/lib/auth-utils";

export function Navbar({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const { logout } = useAuthStore();
  // const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  // Sync auth state on component mount
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const { user } = await validateRequest(); // Requires client-compatible validation
  //     if (user) login(); // Update Zustand state
  //   };
  //   checkAuth();
  // }, [login]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
      console.log(error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2 lg:px-12 flex justify-between items-center ">
        <Link
          href="/"
          className="text-xl font-bold flex items-center justify-center gap-2"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="h-8 w-8"
          />
          Task Manager
        </Link>

        {isAuthenticated && (
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}
