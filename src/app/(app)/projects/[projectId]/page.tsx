"use client";

import KanbanBoard from "@/components/app/kanban/kanban-board";
import { getProject, getProjects } from "@/services/projects";
import { tasks as allTasks } from "@/lib/data";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

export default function ProjectPage({ params }: { params: { projectId: string } }) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProject() {
            setLoading(true);
            const p = await getProject(params.projectId);
            setProject(p);
            setLoading(false);
        }
        fetchProject();
    }, [params.projectId]);

    const tasks = allTasks.filter(t => t.projectId === params.projectId);

    if (loading) {
        return <div>Loading project...</div>;
    }

    if (!project) {
        notFound();
    }

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold font-headline mb-4">{project.name}</h1>
            <p className="text-muted-foreground mb-6">{project.description}</p>
            <div className="flex-1 overflow-x-auto">
                 <KanbanBoard tasks={tasks} />
            </div>
        </div>
    );
}
