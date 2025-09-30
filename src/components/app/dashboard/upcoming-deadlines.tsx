import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { users } from "@/lib/data"
import { getTasks } from "@/services/tasks"
import { differenceInDays, format } from "date-fns"
import { useEffect, useState } from "react"
import type { Task } from "@/lib/types"

export default function UpcomingDeadlines() {
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchUpcomingTasks() {
      const tasks = await getTasks();
      const upcoming = tasks
        .filter(task => task.dueDate && task.status !== 'Done' && differenceInDays(new Date(task.dueDate), new Date()) <= 7 && differenceInDays(new Date(task.dueDate), new Date()) >= 0)
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
        .slice(0, 5);
      setUpcomingTasks(upcoming);
    }
    fetchUpcomingTasks();
  }, []);
  

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead className="text-right">Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {upcomingTasks.map(task => {
          const assignee = users.find(u => u.id === task.assigneeId);
          return (
            <TableRow key={task.id}>
              <TableCell>
                <div className="font-medium">{task.title}</div>
              </TableCell>
              <TableCell>
                {assignee && (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{assignee.name}</span>
                    </div>
                )}
              </TableCell>
              <TableCell className="text-right">{task.dueDate && format(new Date(task.dueDate), "MMM d, yyyy")}</TableCell>
            </TableRow>
          )
        })}
         {upcomingTasks.length === 0 && (
            <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No deadlines in the next 7 days.
                </TableCell>
            </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
