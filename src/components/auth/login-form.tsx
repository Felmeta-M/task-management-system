"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { loginUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema, TLoginSchema } from "@/types/auth";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const { login } = useAuthStore();
  const router = useRouter();
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: TLoginSchema) => {
    try {
      // const token = await loginUser(values);
      // login(token);
      // toast.success("Login successful");
      // router.push("/");
      // router.refresh();

      await loginUser(values);
      login();
      toast.success("Login successful");
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Invalid credentials"
      );
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full cursor-pointer disabled:bg-gray-500"
        >
          {form.formState.isSubmitting ? "Logging in..." : "Login"}
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
        </Button>
      </form>
    </Form>
  );
}
