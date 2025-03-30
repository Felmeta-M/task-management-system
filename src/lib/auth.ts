import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = process.env.JWT_SECRET || '123';
if (!SECRET_KEY) throw new Error('JWT_SECRET is missing in enviroment variables');

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '30m' });
};

// export const verifyToken = (token: string) => {
//   try {
//     return jwt.verify(token, SECRET_KEY) as { userId: number };
//   } catch (error) {
//     console.error('Token verification failed:', error);
//     return null;
//   }
// };

//  token verification
export const verifyToken = async (token: string): Promise<{ userId: number } | null> => {
  try {
    if (!token) return null;

    // Simple validation - in production use a proper JWT library
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    
    // Validate required fields
    if (!payload?.userId || !payload?.exp) return null;
    
    // Check expiration
    if (Date.now() >= payload.exp * 1000) return null;
    
    return { userId: payload.userId };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const getCurrentUser = async () => {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  
  // const decoded = await verifyToken(token);
  // if (!decoded) return null;

  const decoded = jwt.verify(token, SECRET_KEY) as { userId: number };
  if (!decoded) return null;
  if (!decoded.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, username: true },
  });
  
  return user;
};