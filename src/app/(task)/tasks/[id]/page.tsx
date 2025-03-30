import { TaskDetail } from "@/components/tasks/task-detail";
// import { validateRoute } from "@/lib/validate-route";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TaskDetailSkeleton } from "@/components/tasks/task-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Detail",
  description: "View task details.",
};

export default function TaskDetailPage({ params }: { params: { id: string } }) {
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
      <Suspense fallback={<TaskDetailSkeleton />}>
        <TaskDetail taskId={taskId} />
      </Suspense>
    </div>
  );
}
