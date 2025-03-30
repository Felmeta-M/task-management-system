import { create } from 'zustand';
import { Task } from '@prisma/client';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  setTasks: (tasks: Task[]) => void;
  setCurrentTask: (task: Task | null) => void;
  addTask: (task: Task) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  removeTask: (id: number) => void;
  clearCurrentTask: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  currentTask: null,
  setTasks: (tasks) => set({ tasks }),
  setCurrentTask: (task) => set({ currentTask: task }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      ),
    })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  clearCurrentTask: () => set({ currentTask: null }),
}));