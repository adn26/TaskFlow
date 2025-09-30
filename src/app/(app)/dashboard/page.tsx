import type { Metadata } from "next";
import { Activity, ArrowUpRight, CreditCard, DollarSign, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ProjectCompletionChart from "@/components/app/dashboard/project-completion-chart";
import TasksPerStatusChart from "@/components/app/dashboard/tasks-per-status-chart";
import UpcomingDeadlines from "@/components/app/dashboard/upcoming-deadlines";
import { tasks, projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dashboard | TaskFlow",
  description: "Your project overview.",
};

export default function DashboardPage() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;


  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              All active and completed projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              + {completionPercentage}% this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'In Progress').length}</div>
            <p className="text-xs text-muted-foreground">
              Tasks currently in progress
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Overview of completion status for all projects.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ProjectCompletionChart />
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
            <CardDescription>Distribution of tasks in the current lifecycle.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <TasksPerStatusChart />
          </CardContent>
        </Card>
         <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks that are due soon.</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingDeadlines />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
