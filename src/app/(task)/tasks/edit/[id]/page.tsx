import { TaskForm, TaskFormSkeleton } from "@/components/tasks/task-form";
// import { validateRoute } from "@/lib/validate-route";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Edit Task",
  description: "Edit an existing task",
};

export default function EditTaskPage({ params }: { params: { id: string } }) {
  // const { isValid } = validateRoute.sync();
  // if (!isValid) {
  //   return (
  //     <div className="container mx-auto py-8 text-center">
  //       <p>Unauthorized access. Redirecting to login...</p>
  //     </div>
  //   );
  // }

  const taskId = parseInt(params.id);
  if (isNaN(taskId)) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<TaskFormSkeleton />}>
        <TaskForm isEditMode={true} taskId={taskId} />
      </Suspense>
    </div>
  );
}
