"use client"

import { useEffect, useRef } from "react"

export function TeamEmotionMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return

    // Mock data for the heatmap
    const teamMembers = ["Budi", "Siti", "Andi", "Rina", "Alex"]
    const timePoints = ["09.00", "09.05", "09.10", "09.15", "09.20", "09.25", "09.30"]

    // Emotion data: 0 = angry, 0.25 = sad, 0.5 = neutral, 0.75 = happy, 1 = very happy
    const emotionData = [
      [0.75, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7], // John
      [0.5, 0.6, 0.7, 0.8, 0.7, 0.6, 0.5], // Jane
      [0.3, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8], // Mike
      [0.9, 0.8, 0.7, 0.6, 0.7, 0.8, 0.9], // Sarah
      [0.6, 0.5, 0.4, 0.3, 0.2, 0.3, 0.4], // Alex
    ]

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw heatmap
    const cellWidth = (ctx.canvas.width - 100) / timePoints.length
    const cellHeight = (ctx.canvas.height - 60) / teamMembers.length

    // Draw time labels
    ctx.font = "12px Arial"
    ctx.fillStyle = "#666"
    timePoints.forEach((time, i) => {
      ctx.fillText(time, 100 + i * cellWidth + cellWidth / 2 - 15, 30)
    })

    // Draw team member labels
    teamMembers.forEach((member, i) => {
      ctx.fillText(member, 50, 60 + i * cellHeight + cellHeight / 2 + 5)
    })

    // Draw cells
    emotionData.forEach((memberData, memberIndex) => {
      memberData.forEach((value, timeIndex) => {
        // Map emotion value to color
        let color
        if (value < 0.2)
          color = "#f87171" // Red for angry
        else if (value < 0.4)
          color = "#94a3b8" // Gray for sad
        else if (value < 0.6)
          color = "#60a5fa" // Blue for neutral
        else if (value < 0.8)
          color = "#4ade80" // Green for happy
        else color = "#22c55e" // Bright green for very happy

        ctx.fillStyle = color
        ctx.fillRect(100 + timeIndex * cellWidth, 60 + memberIndex * cellHeight, cellWidth, cellHeight)

        // Add emotion emoji
        ctx.font = "16px Arial"
        ctx.fillStyle = "#fff"
        let emoji
        if (value < 0.2) emoji = "😠"
        else if (value < 0.4) emoji = "😔"
        else if (value < 0.6) emoji = "😐"
        else if (value < 0.8) emoji = "😊"
        else emoji = "😁"

        ctx.fillText(
          emoji,
          100 + timeIndex * cellWidth + cellWidth / 2 - 8,
          60 + memberIndex * cellHeight + cellHeight / 2 + 6,
        )
      })
    })

    // Draw legend
    const legendItems = [
      { label: "Sangat Senang", color: "#22c55e", emoji: "😁" },
      { label: "Senang", color: "#4ade80", emoji: "😊" },
      { label: "Netral", color: "#60a5fa", emoji: "😐" },
      { label: "Sedih", color: "#94a3b8", emoji: "😔" },
      { label: "Marah", color: "#f87171", emoji: "😠" },
    ]

    const legendX = 100
    const legendY = ctx.canvas.height - 20

    legendItems.forEach((item, i) => {
      const x = legendX + i * 120
      ctx.fillStyle = item.color
      ctx.fillRect(x, legendY, 15, 15)
      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.fillText(`${item.emoji} ${item.label}`, x + 20, legendY + 12)
    })
  }, [])

  return (
    <div className="w-full h-[400px] relative">
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-full"></canvas>
    </div>
  )
}
