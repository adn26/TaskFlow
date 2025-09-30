import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Task } from "@/lib/types";
import { users } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import CommentThread from "./comment-thread";
import FileAttachments from "./file-attachments";
import { ScrollArea } from "../ui/scroll-area";

type TaskDetailsDialogProps = {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TaskDetailsDialog({ task, open, onOpenChange }: TaskDetailsDialogProps) {
  const assignee = users.find(user => user.id === task.assigneeId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{task.title}</DialogTitle>
          <DialogDescription>
            In project: {task.projectId}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="attachments">Files</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p>{task.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Assignee</h3>
                  {assignee ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                        <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{assignee.name}</span>
                    </div>
                  ) : (
                    <p>Unassigned</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                  <p>{task.dueDate ? format(task.dueDate, "MMMM d, yyyy") : "No due date"}</p>
                </div>
                 <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p>{task.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                  <p>{task.tags?.join(", ") || "None"}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="comments">
             <ScrollArea className="h-[400px] pr-4">
                <CommentThread taskId={task.id} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="attachments">
            <FileAttachments taskId={task.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
