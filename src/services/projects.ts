'use client';
import type { Project } from '@/lib/types';

// Helper function to get projects from localStorage
const getProjectsFromStorage = (): Project[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const projectsJson = localStorage.getItem('projects');
  return projectsJson ? JSON.parse(projectsJson) : [];
};

// Helper function to save projects to localStorage
const saveProjectsToStorage = (projects: Project[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('projects', JSON.stringify(projects));
};

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const projects = getProjectsFromStorage();
    const newProject: Project = {
        id: `proj-${Date.now()}`,
        ...project,
    };
    const updatedProjects = [...projects, newProject];
    saveProjectsToStorage(updatedProjects);
    return newProject;
}

export async function getProjects(): Promise<Project[]> {
    return getProjectsFromStorage();
}

export async function getProject(id: string): Promise<Project | null> {
    const projects = getProjectsFromStorage();
    const project = projects.find(p => p.id === id);
    return project || null;
}
