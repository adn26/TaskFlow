"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { projects, tasks } from "@/lib/data"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  completion: {
    label: "Completion",
    color: "hsl(var(--primary))",
  },
};

export default function ProjectCompletionChart() {
    const data = projects.map(project => {
        const projectTasks = tasks.filter(task => task.projectId === project.id);
        const completedTasks = projectTasks.filter(task => task.status === 'Done').length;
        const completion = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
        return {
            name: project.name,
            completion: Math.round(completion),
        }
    });

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} accessibilityLayer>
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey="completion" fill="var(--color-completion)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
