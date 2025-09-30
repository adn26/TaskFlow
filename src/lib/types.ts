export type UserRole = 'Admin' | 'Manager' | 'Team Member';

export type User = {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
};

export type Project = {
  id: string;
  name:string;
  description: string;
};

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string;
  dueDate?: Date;
  tags?: string[];
};

export type Comment = {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  parentId?: string;
};

export type Attachment = {
  id: string;
  fileName: string;
  fileType: 'image' | 'pdf';
  url: string;
  size: string;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  urgency: 'high' | 'medium' | 'low';
  userRole: UserRole;
  taskId?: string;
  dueDate?: string;
};
