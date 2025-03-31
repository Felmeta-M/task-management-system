import { TaskStatus } from '@prisma/client';
import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(50, 'Title must be less than 50 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  status: z.nativeEnum(TaskStatus, {
    required_error: 'Status is required',
  }),
  dueDate: z.date()
    .min(new Date(), 'Due date must be in the future')
    .optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;