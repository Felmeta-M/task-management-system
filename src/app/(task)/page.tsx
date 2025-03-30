import { taskColumns, TaskTable } from "@/components/tasks/task-table";
import { Button } from "@/components/ui/button";
// import { validateRoute } from "@/lib/validate-route";
import Link from "next/link";
// import { redirect } from "next/navigation";
// import { useAuthStore } from "@/stores/auth-store";
// import { useEffect } from "react";
// import { validateRequest } from "@/lib/auth-utils";

export default async function TasksPage() {
  // const { isValid } = await validateRoute.async();
  // if (!isValid) {
  //   redirect("/login");
  // }

  // const { isAuthenticated, logout } = useAuthStore();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const { user } = await validateRequest();
  //     if (!user && isAuthenticated) logout();
  //   };
  //   checkAuth();
  // }, [isAuthenticated, logout]);

  return (
    <div className="container mx-auto lg:px-8">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl  font-bold text-gray-800">Task Dashboard</h1>
          <Button asChild>
            <Link href="/tasks/new">Create New Task</Link>
          </Button>
        </div>
        <div className="bg-white rounded-sm shadow-accent">
          <TaskTable columns={taskColumns} />
        </div>
      </div>
    </div>
  );
}
