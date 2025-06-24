"use client"

import { useEffect, useRef } from "react"

export function TeamTimeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return

    // Mock data for the timeline
    const timePoints = ["09.00", "09.05", "09.10", "09.15", "09.20", "09.25", "09.30"]

    // Emotion data for each type over time (0-100)
    const happyData = [70, 75, 65, 60, 65, 70, 75]
    const neutralData = [20, 15, 20, 25, 20, 15, 10]
    const stressedData = [5, 5, 10, 10, 10, 10, 5]
    const sadData = [3, 3, 3, 3, 3, 3, 5]
    const angryData = [2, 2, 2, 2, 2, 2, 5]

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Set up chart dimensions
    const chartHeight = ctx.canvas.height - 80
    const chartWidth = ctx.canvas.width - 60

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(50, 40)
    ctx.lineTo(50, chartHeight + 40)
    ctx.lineTo(chartWidth + 50, chartHeight + 40)
    ctx.strokeStyle = "#ccc"
    ctx.stroke()

    // Draw time labels
    ctx.font = "12px Arial"
    ctx.fillStyle = "#666"
    timePoints.forEach((time, i) => {
      const x = 50 + i * (chartWidth / (timePoints.length - 1))
      ctx.fillText(time, x - 15, chartHeight + 60)
    })

    // Draw percentage labels
    for (let i = 0; i <= 100; i += 20) {
      const y = chartHeight + 40 - (i / 100) * chartHeight
      ctx.fillText(`${i}%`, 20, y + 5)

      // Draw horizontal grid lines
      ctx.beginPath()
      ctx.moveTo(50, y)
      ctx.lineTo(chartWidth + 50, y)
      ctx.strokeStyle = "#eee"
      ctx.stroke()
    }

    // Draw stacked area chart
    const drawStackedArea = (data: number[], prevData: number[] = [], color: string) => {
      ctx.beginPath()

      // Start at the bottom left
      ctx.moveTo(50, chartHeight + 40)

      // Draw bottom line (previous data top line)
      for (let i = 0; i < timePoints.length; i++) {
        const x = 50 + i * (chartWidth / (timePoints.length - 1))
        const prevValue = prevData[i] || 0
        const y = chartHeight + 40 - (prevValue / 100) * chartHeight
        ctx.lineTo(x, y)
      }

      // Draw top line (current data + previous data)
      for (let i = timePoints.length - 1; i >= 0; i--) {
        const x = 50 + i * (chartWidth / (timePoints.length - 1))
        const value = data[i] + (prevData[i] || 0)
        const y = chartHeight + 40 - (value / 100) * chartHeight
        ctx.lineTo(x, y)
      }

      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }

    // Calculate cumulative data for stacking
    const angryStack = [...angryData]
    const sadStack = angryData.map((val, i) => val + sadData[i])
    const stressedStack = sadStack.map((val, i) => val + stressedData[i])
    const neutralStack = stressedStack.map((val, i) => val + neutralData[i])

    // Draw each emotion area
    drawStackedArea(happyData, neutralStack, "#4ade80") // Green for happy
    drawStackedArea(neutralData, stressedStack, "#60a5fa") // Blue for neutral
    drawStackedArea(stressedData, sadStack, "#facc15") // Yellow for stressed
    drawStackedArea(sadData, angryStack, "#94a3b8") // Gray for sad
    drawStackedArea(angryData, [], "#f87171") // Red for angry

    // Draw legend
    const legendItems = [
      { label: "Senang", color: "#4ade80" },
      { label: "Netral", color: "#60a5fa" },
      { label: "Stres", color: "#facc15" },
      { label: "Sedih", color: "#94a3b8" },
      { label: "Marah", color: "#f87171" },
    ]

    const legendX = 50
    const legendY = 20

    legendItems.forEach((item, i) => {
      const x = legendX + i * 100
      ctx.fillStyle = item.color
      ctx.fillRect(x, legendY, 15, 15)
      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.fillText(item.label, x + 20, legendY + 12)
    })
  }, [])

  return (
    <div className="w-full h-[400px] relative">
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-full"></canvas>
    </div>
  )
}
