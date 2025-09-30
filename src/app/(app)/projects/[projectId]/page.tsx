"use client";

import KanbanBoard from "@/components/app/kanban/kanban-board";
import { getProject } from "@/services/projects";
import { getTasks } from "@/services/tasks";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Project, Task } from "@/lib/types";

export default function ProjectPage() {
    const params = useParams<{ projectId: string }>();
    const projectId = params.projectId;
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async (pId: string) => {
        const allTasks = await getTasks();
        const projectTasks = allTasks.filter(t => t.projectId === pId);
        setTasks(projectTasks);
    };

    useEffect(() => {
        async function fetchProject() {
            if (!projectId) return;
            setLoading(true);
            const p = await getProject(projectId);
            setProject(p);
            if (p) {
                await fetchTasks(p.id);
            }
            setLoading(false);
        }
        fetchProject();
    }, [projectId]);

    const handleTaskCreated = async () => {
        if(projectId) {
            await fetchTasks(projectId);
        }
    }


    if (loading) {
        return <div>Loading project...</div>;
    }

    if (!project) {
        return notFound();
    }

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold font-headline mb-4">{project.name}</h1>
            <p className="text-muted-foreground mb-6">{project.description}</p>
            <div className="flex-1 overflow-x-auto">
                 <KanbanBoard tasks={tasks} onTaskCreated={handleTaskCreated} projectId={projectId}/>
            </div>
        </div>
    );
}
