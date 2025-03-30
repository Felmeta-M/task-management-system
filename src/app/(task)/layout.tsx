import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { QueryProvider } from "@/providers/query-providers";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "../../components/navbar";
// import { TaskProvider } from "@/providers/task-provider";
import { validateRequest } from "@/lib/auth-utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Management System",
  description: "Manage your tasks efficiently",
};

export default async function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check (no client-side useEffect needed)
  const { user } = await validateRequest();
  if (!user) {
    // Redirect handled by middleware, but this ensures server-side protection
    return <div>Unauthorized. Redirecting...</div>;
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {/* <TaskProvider> */}
          <div className="min-h-screen bg-gray-50">
            {/* <Navbar /> */}
            <Navbar isAuthenticated={!!user} /> {/* Pass auth state */}
            <main className="container mx-auto px-4 py-4">{children}</main>
          </div>
          <Toaster />
          {/* </TaskProvider> */}
        </QueryProvider>
      </body>
    </html>
  );
}
