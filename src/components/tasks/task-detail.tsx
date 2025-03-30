"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationDialog } from "@/components/delete-alert";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteTask, useTask } from "@/hooks/use-tasks";
import { Skeleton } from "@/components/ui/skeleton";

const statusMap = {
  TODO: { label: "To Do", color: "bg-gray-100 text-gray-700" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  DONE: { label: "Done", color: "bg-green-100 text-green-800" },
};

interface TaskDetailProps {
  taskId: number;
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteTask } = useDeleteTask();
  const { data: task, isLoading, isError } = useTask(taskId || 0);

  const handleDelete = () => {
    deleteTask(taskId, {
      onSuccess: () => {
        router.push("/");
      },
      onError: (error) => {
        toast.error("Failed to delete task");
        console.error("Error deleting task:", error);
      },
    });
  };

  const handleEdit = () => {
    router.push(`/tasks/edit/${taskId}`);
  };

  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  if (isError || !task) {
    return (
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Task Not Found</h1>
        <p>The requested task could not be found.</p>
        <Button onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/")}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Task Details</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Delete
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <Badge
              className={`mt-2 px-2 py-1 text-xs rounded-md ${
                statusMap[task.status].color
              }`}
            >
              {statusMap[task.status].label}
            </Badge>
          </div>
          {task.dueDate && (
            <div className="text-sm text-gray-700">
              <span className="font-medium">Due Date:</span>{" "}
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {task.description || "No description provided."}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          <p>
            Created:{" "}
            {new Date(task.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {task.updatedAt && (
            <p>
              Last updated:{" "}
              {new Date(task.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
}

export function TaskDetailSkeleton() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-48 rounded-md" />
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
          <Skeleton className="h-6 w-32 rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 rounded-md" />
          <Skeleton className="h-5 w-40 rounded-md" />
        </div>
      </div>
    </div>
  );
}
