"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

export interface E1RMPoint {
  date: string
  e1rm: number
}

interface ChartItem {
  label: string
  e1rm: number
}

function formatLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

interface E1RMChartProps {
  data: E1RMPoint[]
  height?: number
  gradientId?: string
}

const LIME = "oklch(89% 0.23 128)"

const TOOLTIP_CONTENT_STYLE: React.CSSProperties = {
  background: "oklch(10% 0.003 60)",
  border: "1px solid oklch(20% 0.004 60)",
  borderRadius: "12px",
  fontSize: "11px",
  padding: "8px 12px",
  boxShadow: "0 8px 32px -4px oklch(0% 0 0 / 0.4)",
}

const TOOLTIP_LABEL_STYLE: React.CSSProperties = {
  color: "oklch(60% 0.003 60)",
  marginBottom: "2px",
  fontSize: "10px",
}

const TOOLTIP_ITEM_STYLE: React.CSSProperties = {
  color: "oklch(97% 0.002 60)",
  fontWeight: "700",
}

export function E1RMChart({ data, height = 120, gradientId = "e1rm-grad" }: E1RMChartProps) {
  if (data.length < 2) {
    return (
      <div
        className="flex items-center justify-center text-[11px] text-fg-subtle"
        style={{ height }}
      >
        Log more sets to see the trend
      </div>
    )
  }

  const chartData: ChartItem[] = data.map(d => ({
    label: formatLabel(d.date),
    e1rm: d.e1rm,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 4, right: 2, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={LIME} stopOpacity={0.22} />
            <stop offset="95%" stopColor={LIME} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="oklch(20% 0.004 60)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fill: "oklch(55% 0.003 60)", fontSize: 9 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis hide domain={["auto", "auto"]} />
        <Tooltip
          formatter={(value) => [typeof value === "number" ? `${value.toFixed(1)} kg` : "—", "e1RM"]}
          contentStyle={TOOLTIP_CONTENT_STYLE}
          labelStyle={TOOLTIP_LABEL_STYLE}
          itemStyle={TOOLTIP_ITEM_STYLE}
          cursor={{ stroke: LIME, strokeWidth: 1, strokeDasharray: "4 2" }}
        />
        <Area
          type="monotone"
          dataKey="e1rm"
          stroke={LIME}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: LIME, stroke: "oklch(10% 0.003 60)", strokeWidth: 2 }}
          animationDuration={700}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
