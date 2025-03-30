import { cookies } from 'next/headers';
import { verifyToken } from './auth';

export const validateRequest = async () => {
  const token = (await cookies()).get('token')?.value;
  
  if (!token) {
    return { user: null };
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    return { user: null };
  }

  return { 
    user: { 
      id: decoded.userId 
    } 
  };
};

// // src/lib/auth-utils.ts (Client-compatible version)
// "use client";

// export const validateClientAuth = async () => {
//   try {
//     const res = await fetch("/api/auth/validate", {
//       method: "GET",
//       credentials: "include",
//     });
//     return await res.json();
//   } catch (error) {
//     return { user: null };
//   }
// };