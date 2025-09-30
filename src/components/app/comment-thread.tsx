import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { users } from "@/lib/data";
import { getCommentsForTask, addComment } from "@/services/comments";
import type { Comment as CommentType } from "@/lib/types";
import { Reply } from "lucide-react";

type CommentThreadProps = {
  taskId: string;
};

type CommentItemProps = {
  comment: CommentType;
  allComments: CommentType[];
  onReplySubmit: (content: string, parentId: string) => void;
  currentUser: (typeof users)[0];
};

function CommentItem({ comment, allComments, onReplySubmit, currentUser }: CommentItemProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const user = users.find((u) => u.id === comment.userId);
  const replies = allComments.filter((c) => c.parentId === comment.id);

  const handleReply = () => {
    if (replyContent.trim()) {
      onReplySubmit(replyContent, comment.id);
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  return (
    <div className="flex gap-4">
      <Avatar className="h-9 w-9">
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
          className="mt-1 -ml-2 h-auto px-2 py-1 text-xs"
          onClick={() => {
            setReplyingTo(replyingTo === comment.id ? null : comment.id);
            setReplyContent("");
          }}
        >
          <Reply className="mr-1 h-3 w-3" />
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
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply}>
                  Post Reply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {replies.length > 0 && (
          <div className="mt-4 space-y-4 border-l-2 border-muted pl-4">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                allComments={allComments}
                onReplySubmit={onReplySubmit}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default function CommentThread({ taskId }: CommentThreadProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  
  const currentUser = users[0];

  const fetchComments = async () => {
    const taskComments = await getCommentsForTask(taskId);
    setComments(taskComments);
  };

  useEffect(() => {
    fetchComments();
    
    window.addEventListener('storage', fetchComments);
    return () => window.removeEventListener('storage', fetchComments);

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

    if (!parentId) {
      setNewComment("");
    }
    
    fetchComments();
  };

  const topLevelComments = comments.filter(c => !c.parentId);

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
        {topLevelComments.map(comment => (
            <CommentItem 
                key={comment.id}
                comment={comment}
                allComments={comments}
                onReplySubmit={handleAddComment}
                currentUser={currentUser}
            />
        ))}
         {topLevelComments.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            No comments yet. Start the conversation!
          </div>
        )}
      </div>
    </div>
  );
}
