import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTaskStore } from '@/stores/task-store';
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from '@/actions/task';
import { toast } from 'sonner';
import { Task } from '@prisma/client';

export const useTasks = () => {
  const { setTasks } = useTaskStore();
  
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const data = await getTasks();
      setTasks(data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTask = (id: number) => {
  const { setCurrentTask } = useTaskStore();
  
  return useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const data = await getTaskById(id);
      setCurrentTask(data);
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { addTask, clearCurrentTask } = useTaskStore();
  
  return useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      addTask(data);
      clearCurrentTask();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create task');
      console.error('Error creating task:', error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { updateTask: updateStoreTask } = useTaskStore();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) => updateTask(id, data),
    onMutate: async (variables) => {
      // await queryClient.cancelQueries(['task', variables.id]);
      // const previousTask = queryClient.getQueryData(['task', variables.id]);
      
      // // Optimistic update
      // queryClient.setQueryData(['task', variables.id], (old: any) => ({
      //   ...old,
      //   ...variables.data
      // }));

      await queryClient.cancelQueries(['tasks']);
      const previousTask = queryClient.getQueryData(['tasks']);
      
      queryClient.setQueryData(['tasks'], (old: Task[]) => 
        old.map(t => t.id === variables.id ? {...t, ...variables.data} : t)
      );
      
      return { previousTask };
    },
    onSuccess: (data) => {
      updateStoreTask(data.id, data);
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task updated successfully');
    },
    onError: (err, variables, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(['task', variables.id], context.previousTask);
      }
      toast.error('Failed to update task');
    }
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { removeTask } = useTaskStore();
  
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, id) => {
      removeTask(id);
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    },
  });
};