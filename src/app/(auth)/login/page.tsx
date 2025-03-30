import { LoginForm } from "@/components/auth/login-form";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth-utils";

export default async function LoginPage() {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 ">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg p-6 md:p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Task Management System</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
