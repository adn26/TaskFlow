import type { Task, TaskStatus } from '@/lib/types';
import KanbanTask from './kanban-task';
import { Circle, CircleDashed, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type KanbanColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
};

const statusConfig = {
    'To Do': { icon: <Circle className="h-4 w-4 text-muted-foreground" />, color: 'bg-gray-400' },
    'In Progress': { icon: <CircleDashed className="h-4 w-4 text-blue-500" />, color: 'bg-blue-500' },
    'Done': { icon: <CheckCircle className="h-4 w-4 text-green-500" />, color: 'bg-green-500' },
}

export default function KanbanColumn({ status, tasks, onDrop, onDragStart }: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const config = statusConfig[status];

  return (
    <div
      className="w-80 flex-shrink-0 bg-muted/50 rounded-lg p-4 flex flex-col"
      onDrop={(e) => onDrop(e, status)}
      onDragOver={handleDragOver}
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                {config.icon}
                <h2 className="font-semibold font-headline">{status}</h2>
                <span className="text-sm text-muted-foreground bg-background rounded-full px-2 py-0.5">{tasks.length}</span>
            </div>
            <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4 text-muted-foreground" />
            </Button>
        </div>
      
      <div className="flex flex-col gap-4 overflow-y-auto flex-1">
        {tasks.map(task => (
          <KanbanTask key={task.id} task={task} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
}
