import KanbanBoard from "@/components/app/kanban/kanban-board";
import { projects, tasks as allTasks } from "@/lib/data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return projects.map(p => ({ projectId: p.id }));
}

export default function ProjectPage({ params }: { params: { projectId: string } }) {
    const project = projects.find(p => p.id === params.projectId);
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
