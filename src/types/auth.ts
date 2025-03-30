import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required")
    .min(3, "Username must be at least 3 characters"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type TLoginSchema = z.infer<typeof loginSchema>;