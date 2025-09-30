'use client';
import type { Comment } from '@/lib/types';
import { initialComments } from '@/lib/data';

// Helper function to get comments from localStorage
const getCommentsFromStorage = (): Comment[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const commentsJson = localStorage.getItem('comments');
  if (commentsJson) {
    return JSON.parse(commentsJson);
  } else {
    // Initialize with mock data if nothing is in storage
    const commentsWithDateStrings = initialComments.map(c => ({...c, createdAt: c.createdAt.toISOString() }));
    localStorage.setItem('comments', JSON.stringify(commentsWithDateStrings));
    return initialComments;
  }
};

// Helper function to save comments to localStorage
const saveCommentsToStorage = (comments: Comment[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('comments', JSON.stringify(comments));
};

export async function addComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
    const comments = getCommentsFromStorage();
    const newComment: Comment = {
        id: `comment-${Date.now()}`,
        ...comment,
    };
    const updatedComments = [...comments, newComment];
    saveCommentsToStorage(updatedComments);
     // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
    return newComment;
}

export async function getCommentsForTask(taskId: string): Promise<Comment[]> {
    const comments = getCommentsFromStorage();
    return comments
        .filter(comment => comment.taskId === taskId)
        .map(comment => ({
            ...comment,
            createdAt: new Date(comment.createdAt)
        }))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}
