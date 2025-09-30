"use client";

import type { Task } from '@/lib/types';
import { users, comments } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, differenceInDays } from 'date-fns';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';
import TaskDetailsDialog from '../task-details-dialog';
import { useState, useMemo } from 'react';

type KanbanTaskProps = {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
};

export default function KanbanTask({ task, onDragStart }: KanbanTaskProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const assignee = users.find(user => user.id === task.assigneeId);
  const dueDate = task.dueDate;
  
  const commentCount = useMemo(() => {
    return comments.filter(c => c.taskId === task.id).length;
  }, [task.id]);

  let dueDateColor = "text-muted-foreground";
  if (dueDate) {
    const daysLeft = differenceInDays(dueDate, new Date());
    if (daysLeft < 0) {
      dueDateColor = "text-red-500";
    } else if (daysLeft <= 3) {
      dueDateColor = "text-amber-500";
    }
  }

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        onClick={() => setIsDialogOpen(true)}
        className="cursor-pointer"
      >
        <Card className="hover:bg-muted/80 transition-colors">
          <CardHeader className="p-4">
            <CardTitle className="text-base">{task.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {task.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            )}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    {dueDate && (
                        <div className={`flex items-center gap-1 ${dueDateColor}`}>
                            <Calendar className="h-4 w-4" />
                            <span>{format(dueDate, "MMM d")}</span>
                        </div>
                    )}
                    {commentCount > 0 && (
                      <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{commentCount}</span>
                      </div>
                    )}
                     <div className="flex items-center gap-1">
                        <Paperclip className="h-4 w-4" />
                        <span>2</span>
                    </div>
                </div>
                 {assignee && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                        <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
      <TaskDetailsDialog task={task} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
