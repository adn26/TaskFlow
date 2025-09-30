import { comments as allComments, users } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";

type CommentThreadProps = {
  taskId: string;
};

export default function CommentThread({ taskId }: CommentThreadProps) {
  const taskComments = allComments.filter(c => c.taskId === taskId && !c.parentId);
  const replies = allComments.filter(c => c.taskId === taskId && c.parentId);

  // For demonstration, let's assume the current user is the first user in the list
  const currentUser = users[0];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Discussion</h3>
        <div className="flex gap-4">
            <Avatar>
                <AvatarImage src={currentUser?.avatarUrl} />
                <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="w-full space-y-2">
                <Textarea placeholder="Add a comment..." />
                <Button>Comment</Button>
            </div>
        </div>
      </div>
      <div className="space-y-4">
        {taskComments.map(comment => {
          const user = users.find(u => u.id === comment.userId);
          const commentReplies = replies.filter(r => r.parentId === comment.id);
          return (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
                
                {commentReplies.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {commentReplies.map(reply => {
                            const replyUser = users.find(u => u.id === reply.userId);
                            return (
                                <div key={reply.id} className="flex gap-4">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={replyUser?.avatarUrl} />
                                        <AvatarFallback>{replyUser?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                        <span className="font-semibold">{replyUser?.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                        </span>
                                        </div>
                                        <p className="text-sm">{reply.content}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
              </div>
            </div>
          );
        })}
         {taskComments.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            No comments yet. Start the conversation!
          </div>
        )}
      </div>
    </div>
  );
}
