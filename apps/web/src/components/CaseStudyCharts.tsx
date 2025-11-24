'use client'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import {
  Label,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
} from 'recharts'

// Technology Stack Pie Chart
interface TechStackPieChartProps {
  layers: {
    name: string
    technologies: string[]
  }[]
}

export function TechStackPieChart({ layers }: TechStackPieChartProps) {
  const colors = ['#03c9a9', '#0a66c2', '#f59e0b', '#10b981', '#ef4444']

  const chartData = layers.map((layer, idx) => ({
    name: layer.name.replace(/Layer \d+:\s*/, '').slice(0, 30),
    value: layer.technologies.length,
    fill: colors[idx % colors.length],
  }))

  const chartConfig = layers.reduce(
    (acc, layer, idx) => {
      const key = layer.name.replace(/Layer \d+:\s*/, '').slice(0, 30)
      acc[key] = {
        label: key,
        color: colors[idx % colors.length],
      }
      return acc
    },
    {} as ChartConfig
  )

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  )
}

// Technology Radar Chart
interface TechRadarChartProps {
  layers: {
    name: string
    technologies: string[]
  }[]
}

export function TechRadarChart({ layers }: TechRadarChartProps) {
  const chartData = layers.map((layer) => ({
    category: layer.name.replace(/Layer \d+:\s*/, '').slice(0, 20),
    count: layer.technologies.length,
  }))

  const chartConfig: ChartConfig = {
    count: {
      label: 'Technologies',
      color: '#03c9a9',
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <RadarChart data={chartData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="category" tick={{ fill: '#ffffff', fontSize: 11 }} />
        <PolarGrid stroke="#ffffff20" />
        <Radar
          dataKey="count"
          fill="#03c9a9"
          fillOpacity={0.6}
          stroke="#03c9a9"
          strokeWidth={2}
        />
      </RadarChart>
    </ChartContainer>
  )
}

// KPI Radial Chart (Before/After Improvement)
interface KPIRadialChartProps {
  name: string
  before: number
  after: number
  unit: string
  improvement: string
}

export function KPIRadialChart({ name, before, after, unit, improvement }: KPIRadialChartProps) {
  const beforeValue = typeof before === 'number' ? before : 0
  const afterValue = typeof after === 'number' ? after : 0

  if (beforeValue === 0) {
    return null
  }

  // Determine if lower is better based on improvement text
  const isLowerBetter = improvement.includes('reduction') ||
                        improvement.includes('faster') ||
                        improvement.includes('↓') ||
                        improvement.includes('cheaper') ||
                        improvement.includes('better')

  let improvementPercentage = 0
  if (isLowerBetter) {
    improvementPercentage = ((beforeValue - afterValue) / beforeValue) * 100
  } else {
    improvementPercentage = ((afterValue - beforeValue) / beforeValue) * 100
  }

  const displayPercentage = Math.min(Math.abs(improvementPercentage), 100)
  const isPositive = improvementPercentage > 0

  const chartData = [
    {
      metric: name,
      value: displayPercentage,
      fill: isPositive ? '#10b981' : '#ef4444',
    },
  ]

  const chartConfig: ChartConfig = {
    value: {
      label: 'Improvement',
      color: isPositive ? '#10b981' : '#ef4444',
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={90 + (displayPercentage * 3.6)}
        innerRadius="60%"
        outerRadius="80%"
      >
        <PolarGrid gridType="circle" stroke="#ffffff20" />
        <RadialBar dataKey="value" cornerRadius={10} />
        <Label
          content={({ viewBox }) => {
            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
              return (
                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy || 0) - 10}
                    className="fill-foreground text-2xl font-bold"
                  >
                    {Math.round(displayPercentage)}%
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy || 0) + 15}
                    className="fill-muted-foreground text-xs"
                  >
                    improvement
                  </tspan>
                </text>
              )
            }
          }}
        />
      </RadialBarChart>
    </ChartContainer>
  )
}

// Phase Duration Radial Chart
interface PhaseDurationChartProps {
  phases: {
    phase: string
    duration: string
  }[]
}

export function PhaseDurationChart({ phases }: PhaseDurationChartProps) {
  const colors = ['#03c9a9', '#0a66c2', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

  const chartData = phases.map((phase, idx) => {
    const durationMatch = phase.duration.match(/Day (\d+)(?:-(\d+))?/)
    const days = durationMatch
      ? (durationMatch[2] ? Number.parseInt(durationMatch[2]) - Number.parseInt(durationMatch[1]) + 1 : 1)
      : 1

    return {
      phase: phase.phase.replace(/Phase [A-H] - /, '').slice(0, 25),
      days,
      fill: colors[idx % colors.length],
    }
  })

  const chartConfig: ChartConfig = chartData.reduce((acc, item) => {
    acc[item.phase] = {
      label: item.phase,
      color: item.fill,
    }
    return acc
  }, {} as ChartConfig)

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <RadialBarChart
        data={chartData}
        innerRadius="20%"
        outerRadius="90%"
        startAngle={90}
        endAngle={-270}
      >
        <PolarGrid gridType="circle" stroke="#ffffff20" />
        <RadialBar
          dataKey="days"
          background={{ fill: '#ffffff10' }}
          label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </RadialBarChart>
    </ChartContainer>
  )
}
