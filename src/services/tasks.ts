'use client';
import type { Task } from '@/lib/types';
import { initialTasks } from '@/lib/data';

// Helper function to get tasks from localStorage
const getTasksFromStorage = (): Task[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const tasksJson = localStorage.getItem('tasks');
  if (tasksJson) {
    return JSON.parse(tasksJson);
  } else {
    // Initialize with mock data if nothing is in storage
    const tasksWithDateObjects = initialTasks.map(t => ({...t, dueDate: t.dueDate ? t.dueDate.toISOString() : undefined }))
    saveTasksToStorage(tasksWithDateObjects as any); // save as string dates
    return initialTasks; // return with date objects for immediate use
  }
};

// Helper function to save tasks to localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const tasks = getTasksFromStorage();
    const newTask: Task = {
        id: `task-${Date.now()}`,
        ...task,
    };
    const updatedTasks = [...tasks, newTask];
    saveTasksToStorage(updatedTasks);
    return newTask;
}

export async function getTasks(): Promise<Task[]> {
    const tasks = getTasksFromStorage();
    // Make sure dates are Date objects
    return tasks.map(task => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
    }));
}

export async function getTask(id: string): Promise<Task | null> {
    const tasks = await getTasks();
    const task = tasks.find(p => p.id === id);
    return task || null;
}

export async function updateTask(updatedTask: Task): Promise<Task> {
    let tasks = await getTasks();
    tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    saveTasksToStorage(tasks);
    return updatedTask;
}
