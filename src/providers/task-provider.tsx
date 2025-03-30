// "use client";

// import { useEffect } from "react";
// import { useTaskStore } from "@/stores/task-store";
// import { getTasks } from "@/actions/task";
// import { toast } from "sonner";
// import { Skeleton } from "@/components/ui/skeleton";

// export function TaskProvider({ children }: { children: React.ReactNode }) {
//   const { setTasks, isLoading, error, clearError } = useTaskStore();

//   useEffect(() => {
//     const loadTasks = async () => {
//       try {
//         const tasks = await getTasks();
//         setTasks(tasks);
//       } catch (error) {
//         toast.error("Failed to load tasks");
//         console.error("Task loading error:", error);
//       }
//     };

//     loadTasks();
//   }, [setTasks]);

//   // Global error handling
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       clearError();
//     }
//   }, [error, clearError]);

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen gap-4">
//         <Skeleton className="h-12 w-full max-w-md" />
//         <Skeleton className="h-8 w-full max-w-2xl" />
//         <Skeleton className="h-8 w-full max-w-2xl" />
//         <Skeleton className="h-8 w-full max-w-2xl" />
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

// export function TaskProvider({ children }: { children: React.ReactNode }) {
//   // Only manage Zustand state, no data fetching
//   return <>{children}</>;
// }
