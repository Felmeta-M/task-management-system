'use server';

import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/types/auth"; 


export async function loginUser(data: unknown) {

  const parsedData = loginSchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error("Invalid input data");
  }

  const { username, password } = parsedData.data;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

  const token = generateToken(user.id);
  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });

  return token;
}
export async function logoutUser() {
    (await cookies()).delete('token');
  }