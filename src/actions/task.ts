'use server';

import { prisma } from '@/lib/prisma';
import { TaskStatus } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { TaskFormValues } from '@/types/task';

export async function getTasks() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    return prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    throw new Error('Failed to fetch tasks');
  }
}

export async function getTaskById(id: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  return prisma.task.findUnique({
    where: { id, userId: user.id },
  });
}

export async function deleteTask(id: number) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await prisma.task.delete({
      where: { id, userId: user.id },
    });

    try {
      revalidatePath('/'); 
    } catch (revalidationError) {
      console.warn("Revalidation failed:", revalidationError);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete task error:', error);
    return { success: false, error: "Failed to delete task" };
  }
}


export async function createTask(data: TaskFormValues) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const task = await prisma.task.create({
      data: {
        ...data,
        userId: user.id,
        dueDate: data.dueDate || null,
      },
    });

    revalidatePath('/');
    return task;
  } catch (error) {
    console.error('Create task error:', error);
    throw new Error('Failed to create task');
  }
}

export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: Date | null;
  }
) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const task = await prisma.task.update({
      where: { id, userId: user.id },
      data,
    });

    revalidatePath('/');
    return task;
  } catch (error) {
    console.error('Update task error:', error);
    throw new Error('Failed to update task');
  }
}