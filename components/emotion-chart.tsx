"use client"

import React, { useEffect, useRef } from "react"

type EmotionTrend = {
  date: string
  happy?: number
  neutral?: number
  stressed?: number
  sad?: number
  angry?: number
}

type EmotionChartProps = {
  data: EmotionTrend[]
}

export function EmotionChart({ data }: EmotionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx || !data || data.length === 0) return

    // Build labels and emotion arrays from data
    const labels = data.map((d) => new Date(d.date).toLocaleDateString("id-ID", { weekday: "short" }))
    const happyData = data.map((d) => Math.round((d.happy ?? 0) * 100))
    const neutralData = data.map((d) => Math.round((d.neutral ?? 0) * 100))
    const stressData = data.map((d) => Math.round((d.stressed ?? 0) * 100))
    const sadData = data.map((d) => Math.round((d.sad ?? 0) * 100))
    const angryData = data.map((d) => Math.round((d.angry ?? 0) * 100))

    // Draw chart (simplified representation)
    const chartHeight = ctx.canvas.height - 40
    const chartWidth = ctx.canvas.width - 40
    const barWidth = chartWidth / labels.length / 5 - 2
    const spacing = 2

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(30, 10)
    ctx.lineTo(30, chartHeight + 20)
    ctx.lineTo(chartWidth + 30, chartHeight + 20)
    ctx.strokeStyle = "#ccc"
    ctx.stroke()

    // Draw labels
    ctx.font = "10px Arial"
    ctx.fillStyle = "#666"
    labels.forEach((label, i) => {
      const x = 30 + i * (chartWidth / labels.length) + chartWidth / labels.length / 2
      ctx.fillText(label, x - 10, chartHeight + 35)
    })

    // Draw data
    const drawBar = (data: number[], color: string, offset: number) => {
      data.forEach((value, i) => {
        const x = 30 + i * (chartWidth / labels.length) + offset
        const barHeight = (value / 100) * chartHeight
        ctx.fillStyle = color
        ctx.fillRect(x, chartHeight + 20 - barHeight, barWidth, barHeight)
      })
    }

    drawBar(happyData, "#4ade80", 2) // Green for happy
    drawBar(neutralData, "#60a5fa", 2 + barWidth + spacing) // Blue for neutral
    drawBar(stressData, "#facc15", 2 + (barWidth + spacing) * 2) // Yellow for stress
    drawBar(sadData, "#94a3b8", 2 + (barWidth + spacing) * 3) // Gray for sad
    drawBar(angryData, "#f87171", 2 + (barWidth + spacing) * 4) // Red for angry

    // Draw legend
    const legendY = 15
    const emotions = [
      { name: "Bahagia", color: "#4ade80" },
      { name: "Netral", color: "#60a5fa" },
      { name: "Stres", color: "#facc15" },
      { name: "Sedih", color: "#94a3b8" },
      { name: "Marah", color: "#f87171" },
    ]

    emotions.forEach((emotion, i) => {
      const x = 50 + i * 80
      ctx.fillStyle = emotion.color
      ctx.fillRect(x, legendY, 10, 10)
      ctx.fillStyle = "#666"
      ctx.fillText(emotion.name, x + 15, legendY + 8)
    })
  }, [data])

  if (!data || data.length === 0) return <div className="text-xs text-muted-foreground">Belum ada data tren emosi.</div>
  return (
    <div className="w-full h-[300px] relative">
      <canvas ref={canvasRef} width={800} height={300} className="w-full h-full"></canvas>
    </div>
  )
}
