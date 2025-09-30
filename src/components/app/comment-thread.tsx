import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { users } from "@/lib/data";
import { getCommentsForTask, addComment } from "@/services/comments";
import type { Comment } from "@/lib/types";
import { Reply } from "lucide-react";

type CommentThreadProps = {
  taskId: string;
};

export default function CommentThread({ taskId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  
  // For demonstration, let's assume the current user is the first user in the list
  const currentUser = users[0];

  const fetchComments = async () => {
    const taskComments = await getCommentsForTask(taskId);
    setComments(taskComments);
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const handleAddComment = async (content: string, parentId?: string) => {
    if (!content.trim()) return;

    await addComment({
      taskId,
      userId: currentUser.id,
      content,
      parentId,
      createdAt: new Date(),
    });

    // Reset inputs and state
    if (parentId) {
      setReplyingTo(null);
      setReplyContent("");
    } else {
      setNewComment("");
    }
    
    fetchComments(); // Refresh comments list
  };

  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (commentId: string) => comments.filter(c => c.parentId === commentId);

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
                <Textarea 
                  placeholder="Add a comment..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={() => handleAddComment(newComment)}>Comment</Button>
            </div>
        </div>
      </div>
      <div className="space-y-4">
        {topLevelComments.map(comment => {
          const user = users.find(u => u.id === comment.userId);
          const commentReplies = getReplies(comment.id);
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
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-1 -ml-2"
                    onClick={() => { setReplyingTo(replyingTo === comment.id ? null : comment.id); setReplyContent(""); }}
                >
                    <Reply className="mr-2 h-4 w-4" />
                    Reply
                </Button>
                
                 {replyingTo === comment.id && (
                    <div className="flex gap-4 mt-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser?.avatarUrl} />
                            <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="w-full space-y-2">
                            <Textarea 
                                placeholder={`Replying to ${user?.name}...`}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <Button onClick={() => handleAddComment(replyContent, comment.id)}>Post Reply</Button>
                                <Button variant="ghost" onClick={() => setReplyingTo(null)}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                )}
                
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
         {topLevelComments.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            No comments yet. Start the conversation!
          </div>
        )}
      </div>
    </div>
  );
}
