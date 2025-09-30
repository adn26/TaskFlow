"use client";

import KanbanBoard from "@/components/app/kanban/kanban-board";
import { getProject } from "@/services/projects";
import { tasks as allTasks } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

export default function ProjectPage() {
    const params = useParams<{ projectId: string }>();
    const projectId = params.projectId;
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProject() {
            if (!projectId) return;
            setLoading(true);
            const p = await getProject(projectId);
            setProject(p);
            setLoading(false);
        }
        fetchProject();
    }, [projectId]);

    const tasks = allTasks.filter(t => t.projectId === projectId);

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
                 <KanbanBoard tasks={tasks} />
            </div>
        </div>
    );
}
