// import { cookies } from 'next/headers';
// import { verifyToken } from './auth';

// export const validateRoute = {
//   sync: () => {
//     const token = cookies().get('token')?.value;
//     if (!token) return { isValid: false, userId: null };

//     try {
//       const parts = token.split('.');
//       if (parts.length !== 3) return { isValid: false, userId: null };

//       const payload = JSON.parse(atob(parts[1]));
//       return {
//         isValid: !!payload?.userId && Date.now() < payload.exp * 1000,
//         userId: payload?.userId || null,
//       };
//     } catch {
//       return { isValid: false, userId: null };
//     }
//   },
//   async: async () => {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token')?.value;
//     if (!token) return { isValid: false, userId: null };

//     const decoded = await verifyToken(token);
//     return {
//       isValid: !!decoded,
//       userId: decoded?.userId || null,
//     };
//   },
// };
