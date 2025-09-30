import KanbanBoard from "@/components/app/kanban/kanban-board";
import { getProject, getProjects } from "@/services/projects";
import { tasks as allTasks } from "@/lib/data";
import { notFound } from "next/navigation";

// This tells Next.js to not statically generate these pages at build time
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    const projects = await getProjects();
    return projects.map(p => ({ projectId: p.id }));
}

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
    const project = await getProject(params.projectId);
    const tasks = allTasks.filter(t => t.projectId === params.projectId);

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
