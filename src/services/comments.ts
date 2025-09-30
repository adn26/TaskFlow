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
    try {
        const parsed = JSON.parse(commentsJson);
        // Ensure createdAt is a Date object
        return parsed.map((c: any) => ({...c, createdAt: new Date(c.createdAt)}));
    } catch (e) {
        console.error("Failed to parse comments from localStorage", e);
        return [];
    }
  } else {
    // Initialize with mock data if nothing is in storage
    localStorage.setItem('comments', JSON.stringify(initialComments));
    return initialComments;
  }
};

// Helper function to save comments to localStorage
const saveCommentsToStorage = (comments: Comment[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  // Convert Date objects to ISO strings before saving
  const commentsWithStringDates = comments.map(c => ({...c, createdAt: c.createdAt.toISOString()}));
  localStorage.setItem('comments', JSON.stringify(commentsWithStringDates));
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
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}
