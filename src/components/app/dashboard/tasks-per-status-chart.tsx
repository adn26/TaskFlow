"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { tasks, taskStatuses } from "@/lib/data"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"


const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  "To Do": {
    label: "To Do",
    color: "hsl(var(--chart-3))",
  },
  "In Progress": {
    label: "In Progress",
    color: "hsl(var(--chart-4))",
  },
  "Done": {
    label: "Done",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function TasksPerStatusChart() {
    const data = taskStatuses.map(status => ({
        status,
        count: tasks.filter(task => task.status === status).length,
    }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={data}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    strokeWidth={5}
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartConfig[entry.status as keyof typeof chartConfig].color} />
                ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
     </ChartContainer>
  )
}
