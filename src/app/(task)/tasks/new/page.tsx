import { TaskForm, TaskFormSkeleton } from "@/components/tasks/task-form";
// import { validateRoute } from "@/lib/validate-route";
import { Suspense } from "react";

export const metadata = {
  title: "Create New Task",
  description: "Create a new task in the task management system.",
};

export default function NewTaskPage() {
  // const { isValid } = validateRoute.sync();
  // if (!isValid) {
  //   return (
  //     <div className="container mx-auto py-8 text-center">
  //       <p>Unauthorized access. Redirecting to login...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<TaskFormSkeleton />}>
        <TaskForm isEditMode={false} />
      </Suspense>
    </div>
  );
}
