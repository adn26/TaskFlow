import type { User, Project, Task, Comment, Notification, TaskStatus } from '@/lib/types';

export const users: User[] = [
  { id: 'user-1', name: 'Olivia Martin', role: 'Admin', avatarUrl: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'user-2', name: 'Jackson Lee', role: 'Manager', avatarUrl: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'user-3', name: 'Isabella Nguyen', role: 'Team Member', avatarUrl: 'https://picsum.photos/seed/user3/100/100' },
  { id: 'user-4', name: 'William Kim', role: 'Team Member', avatarUrl: 'https://picsum.photos/seed/user4/100/100' },
  { id: 'user-5', name: 'Sophia Gonzalez', role: 'Team Member', avatarUrl: 'https://picsum.photos/seed/user5/100/100' },
];

export const projects: Project[] = [
  // This is now managed in localStorage by src/services/projects.ts
];

export const initialTasks: Task[] = [
  // Project 1
  { id: 'task-1', projectId: 'proj-1', title: 'Design new homepage mockups', description: 'Create high-fidelity mockups in Figma.', status: 'Done', assigneeId: 'user-3', dueDate: new Date('2024-08-15T23:59:59'), tags: ['design', 'UI'] },
  { id: 'task-2', projectId: 'proj-1', title: 'Develop front-end for homepage', description: 'Implement the new design using React and Tailwind CSS.', status: 'In Progress', assigneeId: 'user-4', dueDate: new Date('2024-08-25T23:59:59'), tags: ['development', 'frontend'] },
  { id: 'task-3', projectId: 'proj-1', title: 'Set up user authentication', description: 'Integrate Firebase auth for user sign-in and sign-up.', status: 'In Progress', assigneeId: 'user-4', dueDate: new Date('2024-08-28T23:59:59'), tags: ['development', 'backend'] },
  { id: 'task-4', projectId: 'proj-1', title: 'Write content for About Us page', description: 'Draft compelling copy for the new About Us section.', status: 'To Do', assigneeId: 'user-5', dueDate: new Date('2024-09-05T23:59:59'), tags: ['content'] },
  { id: 'task-5', projectId: 'proj-1', title: 'Deploy to staging environment', description: 'Push the latest build to the staging server for QA.', status: 'To Do', assigneeId: 'user-2', dueDate: new Date('2024-09-10T23:59:59'), tags: ['devops'] },

  // Project 2
  { id: 'task-6', projectId: 'proj-2', title: 'Plan app store screenshots', description: 'Decide on the key features to highlight in app store images.', status: 'Done', assigneeId: 'user-2', dueDate: new Date('2024-08-10T23:59:59'), tags: ['marketing'] },
  { id: 'task-7', projectId: 'proj-2', title: 'Finalize push notification logic', description: 'Ensure push notifications are triggered correctly.', status: 'In Progress', assigneeId: 'user-3', dueDate: new Date('2024-08-22T23:59:59'), tags: ['development'] },
  { id: 'task-8', projectId: 'proj-2', title: 'Beta testing with internal team', description: 'Distribute beta build and collect feedback.', status: 'To Do', assigneeId: 'user-1', dueDate: new Date('2024-09-01T23:59:59'), tags: ['QA'] },
  
  // Project 3
  { id: 'task-9', projectId: 'proj-3', title: 'Create social media assets', description: 'Design graphics for Facebook, Instagram, and Twitter.', status: 'To Do', assigneeId: 'user-5', dueDate: new Date('2024-08-30T23:59:59'), tags: ['design', 'social media'] },
  { id: 'task-10', projectId: 'proj-3', title: 'Draft email newsletter', description: 'Write the announcement email for the campaign.', status: 'To Do', assigneeId: 'user-5', dueDate: new Date('2024-09-05T23:59:59'), tags: ['content', 'email'] },
];

export const initialComments: Comment[] = [
  { id: 'comment-1', taskId: 'task-2', userId: 'user-2', content: 'Looking good! Just a small suggestion: can we make the primary CTA button a bit larger?', createdAt: new Date('2024-08-20T10:00:00') },
  { id: 'comment-2', taskId: 'task-2', userId: 'user-4', content: 'Good point! I\'ll adjust it now.', parentId: 'comment-1', createdAt: new Date('2024-08-20T10:05:00') },
  { id: 'comment-3', taskId: 'task-2', userId: 'user-1', content: 'What\'s the progress on this?', createdAt: new Date('2024-08-21T14:00:00') },
  { id: 'comment-4', taskId: 'task-3', userId: 'user-1', content: 'I\'ve reviewed the auth flow. It seems solid. Let\'s proceed with the integration.', createdAt: new Date('2024-08-22T11:00:00')},
  { id: 'comment-5', taskId: 'task-3', userId: 'user-4', content: 'Great, thanks for the review. I\'ll merge it into the main branch.', parentId: 'comment-4', createdAt: new Date('2024-08-22T11:30:00')},
  { id: 'comment-6', taskId: 'task-3', userId: 'user-2', content: 'Make sure to add logging around the authentication steps for easier debugging later.', parentId: 'comment-4', createdAt: new Date('2024-08-22T12:00:00')},
  
];

export const notifications: Omit<Notification, 'id' | 'read'>[] = [
  { userId: 'user-1', message: "Task 'Beta testing with internal team' is due soon.", urgency: 'high', userRole: 'Admin', taskId: 'task-8', dueDate: new Date('2024-09-01T23:59:59').toISOString() },
  { userId: 'user-2', message: "You have been assigned to 'Deploy to staging environment'.", urgency: 'medium', userRole: 'Manager', taskId: 'task-5', dueDate: new Date('2024-09-10T23:59:59').toISOString() },
  { userId: 'user-4', message: "Jackson Lee commented on 'Develop front-end for homepage'.", urgency: 'low', userRole: 'Team Member', taskId: 'task-2' },
  { userId: 'user-3', message: "Task 'Finalize push notification logic' is due today.", urgency: 'high', userRole: 'Team Member', taskId: 'task-7', dueDate: new Date('2024-08-22T23:59:59').toISOString() },
  { userId: 'user-5', message: "You have been assigned to 'Write content for About Us page'.", urgency: 'medium', userRole: 'Team Member', taskId: 'task-4', dueDate: new Date('2024-09-05T23:59:59').toISOString() },
];

export const taskStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
