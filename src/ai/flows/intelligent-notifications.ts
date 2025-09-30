// src/ai/flows/intelligent-notifications.ts
'use server';

/**
 * @fileOverview An intelligent notification prioritization AI agent.
 *
 * - prioritizeNotifications - A function that handles the notification prioritization process.
 * - PrioritizeNotificationsInput - The input type for the prioritizeNotifications function.
 * - PrioritizeNotificationsOutput - The return type for the prioritizeNotifications function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeNotificationsInputSchema = z.object({
  notifications: z.array(
    z.object({
      message: z.string().describe('The content of the notification.'),
      urgency: z.enum(['high', 'medium', 'low']).describe('The urgency level of the notification.'),
      userRole: z.enum(['Admin', 'Manager', 'Team Member']).describe('The role of the user receiving the notification.'),
      taskId: z.string().optional().describe('The ID of the task the notification is related to.'),
      dueDate: z.string().optional().describe('The due date of the task the notification is related to.'),
    })
  ).describe('An array of notifications to be prioritized.'),
});

export type PrioritizeNotificationsInput = z.infer<typeof PrioritizeNotificationsInputSchema>;

const PrioritizeNotificationsOutputSchema = z.object({
  prioritizedNotifications: z.array(
    z.object({
      message: z.string().describe('The content of the notification.'),
      urgency: z.enum(['high', 'medium', 'low']).describe('The urgency level of the notification.'),
      userRole: z.enum(['Admin', 'Manager', 'Team Member']).describe('The role of the user receiving the notification.'),
      taskId: z.string().optional().describe('The ID of the task the notification is related to.'),
      dueDate: z.string().optional().describe('The due date of the task the notification is related to.'),
    })
  ).describe('The prioritized array of notifications.'),
});

export type PrioritizeNotificationsOutput = z.infer<typeof PrioritizeNotificationsOutputSchema>;

export async function prioritizeNotifications(input: PrioritizeNotificationsInput): Promise<PrioritizeNotificationsOutput> {
  return prioritizeNotificationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeNotificationsPrompt',
  input: {schema: PrioritizeNotificationsInputSchema},
  output: {schema: PrioritizeNotificationsOutputSchema},
  prompt: `You are a project management assistant. You will receive a list of notifications with different urgency levels and user roles.

  Your task is to prioritize these notifications so that important updates are immediately visible and less critical notifications are grouped or delayed.

  Here are the notifications:
  {{#each notifications}}
  - Message: {{this.message}}, Urgency: {{this.urgency}}, User Role: {{this.userRole}}{{#if this.taskId}}, Task ID: {{this.taskId}}{{#if this.dueDate}}, Due Date: {{this.dueDate}}{{/if}}{{/if}}
  {{/each}}

  Prioritize the notifications based on the following criteria:
  1. High urgency notifications should be at the top.
  2. Notifications for Admins and Managers should be prioritized over Team Members.
  3. Notifications related to tasks with upcoming due dates should be prioritized.

  Return the prioritized list of notifications.

  The output should be a JSON array of notifications, where each notification has the following format:
  {
    "message": "string",
    "urgency": "high" | "medium" | "low",
    "userRole": "Admin" | "Manager" | "Team Member",
    "taskId": "string" | null,
    "dueDate": "string" | null
  }
`,
});

const prioritizeNotificationsFlow = ai.defineFlow(
  {
    name: 'prioritizeNotificationsFlow',
    inputSchema: PrioritizeNotificationsInputSchema,
    outputSchema: PrioritizeNotificationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
