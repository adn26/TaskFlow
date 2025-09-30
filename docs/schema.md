# TaskFlow Database Schema

This document outlines a potential database schema for the TaskFlow application.

## Users

Stores user account information and roles.

- `id` (PK, UUID)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `role` (ENUM: 'Admin', 'Manager', 'Team Member')
- `avatar_url` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Projects

Stores information about individual projects.

- `id` (PK, UUID)
- `name` (VARCHAR)
- `description` (TEXT)
- `owner_id` (FK, Users.id)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Project_Members

A join table to manage user membership and roles within projects.

- `project_id` (FK, Projects.id)
- `user_id` (FK, Users.id)
- `role` (ENUM: 'Manager', 'Team Member')
- `PRIMARY KEY (project_id, user_id)`

## Tasks

Stores all tasks, linked to a project.

- `id` (PK, UUID)
- `project_id` (FK, Projects.id)
- `title` (VARCHAR)
- `description` (TEXT)
- `status` (ENUM: 'To Do', 'In Progress', 'Done')
- `assignee_id` (FK, Users.id, NULLABLE)
- `due_date` (TIMESTAMP, NULLABLE)
- `created_by` (FK, Users.id)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Comments

Stores comments on tasks, with support for threading.

- `id` (PK, UUID)
- `task_id` (FK, Tasks.id)
- `user_id` (FK, Users.id)
- `parent_id` (FK, Comments.id, NULLABLE) - for threading
- `content` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Attachments

Stores information about files attached to tasks.

- `id` (PK, UUID)
- `task_id` (FK, Tasks.id)
- `user_id` (FK, Users.id)
- `file_name` (VARCHAR)
- `file_path` (VARCHAR) - Path to the file in storage
- `file_type` (VARCHAR) - e.g., 'image/jpeg', 'application/pdf'
- `file_size` (INTEGER) - in bytes
- `created_at` (TIMESTAMP)

## Notifications

Stores user notifications.

- `id` (PK, UUID)
- `user_id` (FK, Users.id)
- `message` (VARCHAR)
- `is_read` (BOOLEAN, default: false)
- `link` (VARCHAR, NULLABLE) - e.g., to a task `/projects/proj-1/tasks/task-2`
- `created_at` (TIMESTAMP)
