"use client";

import React, { useState, useEffect } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import { taskStatuses } from '@/lib/data';
import KanbanColumn from './kanban-column';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { updateTask } from '@/services/tasks';

type KanbanBoardProps = {
  tasks: Task[];
  onTaskCreated: () => void;
  projectId: string;
};

export default function KanbanBoard({ tasks: initialTasks, onTaskCreated, projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // This hook is used to avoid hydration mismatch issues by ensuring
    // that the tasks state is only set on the client-side.
    setTasks(initialTasks.map(t => ({...t, dueDate: t.dueDate ? new Date(t.dueDate) : undefined})));
  }, [initialTasks]);


  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    const taskToUpdate = tasks.find(task => task.id === taskId);

    if (taskToUpdate && taskToUpdate.status !== newStatus) {
        const updatedTask = { ...taskToUpdate, status: newStatus };
        await updateTask(updatedTask);
        setTasks(prevTasks =>
            prevTasks.map(task =>
              task.id === taskId ? updatedTask : task
            )
        );
    }
  };

  return (
    <div className="flex gap-6 h-full min-w-max pb-4">
      {taskStatuses.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter(task => task.status === status)}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onTaskCreated={onTaskCreated}
          projectId={projectId}
        />
      ))}
      <div className="w-80 flex-shrink-0">
        <Button variant="outline" className="w-full h-full border-dashed">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Column
        </Button>
      </div>
    </div>
  );
}
