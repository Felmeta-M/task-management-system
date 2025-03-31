"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskFormValues, taskFormSchema } from "@/types/task";
import { TaskStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCreateTask, useUpdateTask, useTask } from "@/hooks/use-tasks";
import { useEffect } from "react";
import { useTaskStore } from "@/stores/task-store";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskFormProps {
  isEditMode?: boolean;
  taskId?: number;
}

export function TaskForm({ isEditMode = false, taskId }: TaskFormProps) {
  const router = useRouter();
  const { currentTask, clearCurrentTask } = useTaskStore();
  const { data: taskData } = useTask(taskId || 0);
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.TODO,
      dueDate: undefined,
    },
  });

  // only resetting form when taskdata is available and different from current values
  useEffect(() => {
    console.log("task data recieved:", taskData);
    if (isEditMode && taskData) {
      console.log("Resetting form with status:", taskData.status);
      form.reset({
        title: taskData.title,
        description: taskData.description || "",
        status: taskData.status || TaskStatus.TODO,
        // status: taskData.status as TaskStatus, // Keep the cast but ensure it's correct
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      });
      console.log("form reseted with task data:", taskData);
    } else {
      form.reset({
        title: "",
        description: "",
        status: TaskStatus.TODO,
        dueDate: undefined,
      });
      clearCurrentTask();
    }
    console.log("Form reset with values:", form.getValues());
    console.log("Current task:", currentTask);
  }, [isEditMode, taskData, form, clearCurrentTask, currentTask]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      if (isEditMode && taskId) {
        await updateTask({ id: taskId, data });
      } else {
        await createTask(data);
      }
      router.push("/");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/")}
          className="cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Task" : "Create New Task"}
        </h1>
      </div>
      <div className="bg-white rounded-sm shadow-accent p-2 sm:p-4 mt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={field.value || "Select task status"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TaskStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => {
                  // today's date at midnight in local timezone
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={{ before: today }}
                            defaultMonth={field.value || today}
                            initialFocus
                            modifiers={{
                              disabled: [
                                {
                                  before: new Date(
                                    today.getFullYear(),
                                    today.getMonth(),
                                    today.getDate()
                                  ),
                                },
                              ],
                            }}
                            modifiersClassNames={{
                              disabled: "opacity-50 pointer-events-none",
                            }}
                            classNames={{
                              months: "p-2",
                              caption:
                                "flex justify-center pt-1 relative items-center",
                              caption_label: "text-sm font-medium",
                              nav: "flex items-center",
                              nav_button:
                                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                              nav_button_previous: "absolute left-1",
                              nav_button_next: "absolute right-1",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex",
                              head_cell:
                                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                              row: "flex w-full mt-2",
                              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                              day: cn(
                                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent",
                                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              ),
                              day_selected:
                                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                              day_today: "bg-accent text-accent-foreground",
                              day_disabled:
                                "text-muted-foreground opacity-50 pointer-events-none",
                              day_outside: "text-muted-foreground opacity-50",
                              day_hidden: "invisible",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isEditMode ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}

export function TaskFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
