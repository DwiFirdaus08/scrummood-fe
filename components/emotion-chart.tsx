"use client";

import React, { useEffect, useRef } from "react";

type EmotionTrend = {
  date: string;
  happy?: number;
  neutral?: number;
  stressed?: number;
  sad?: number;
  angry?: number;
};

type EmotionChartProps = {
  data: EmotionTrend[];
};

export function EmotionChart({ data }: EmotionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !data || data.length === 0) return;

    // Build labels and emotion arrays from data
    const labels = data.map((d) =>
      new Date(d.date).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    const happyData = data.map((d) => Math.round((d.happy ?? 0) * 100));
    const neutralData = data.map((d) => Math.round((d.neutral ?? 0) * 100));
    const stressData = data.map((d) => Math.round((d.stressed ?? 0) * 100));
    const sadData = data.map((d) => Math.round((d.sad ?? 0) * 100));
    const angryData = data.map((d) => Math.round((d.angry ?? 0) * 100));

    // Chart dimensions
    const chartHeight = ctx.canvas.height - 40;
    const chartWidth = ctx.canvas.width - 40;
    const leftPad = 30;
    const bottomPad = 20;
    const topPad = 10;
    const rightPad = 10;
    const n = labels.length;

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(leftPad, topPad);
    ctx.lineTo(leftPad, chartHeight + topPad);
    ctx.lineTo(chartWidth + leftPad, chartHeight + topPad);
    ctx.strokeStyle = "#ccc";
    ctx.stroke();

    // Draw y-axis labels and grid
    ctx.font = "10px Arial";
    ctx.fillStyle = "#666";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= 5; i++) {
      const y = chartHeight + topPad - (i * chartHeight) / 5;
      ctx.fillText(`${i * 20}%`, leftPad - 5, y);
      ctx.beginPath();
      ctx.moveTo(leftPad, y);
      ctx.lineTo(chartWidth + leftPad, y);
      ctx.strokeStyle = "#eee";
      ctx.stroke();
    }

    // Draw x-axis labels
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    labels.forEach((label, i) => {
      const x = leftPad + i * (chartWidth / (n - 1));
      ctx.fillText(label, x, chartHeight + topPad + 8);
    });

    // Helper to draw line/area
    const drawLine = (data: number[], color: string, fill?: string) => {
      ctx.beginPath();
      data.forEach((value, i) => {
        const x = leftPad + i * (chartWidth / (n - 1));
        const y = chartHeight + topPad - (value / 100) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (fill) {
        // Draw area fill
        ctx.lineTo(leftPad + chartWidth, chartHeight + topPad);
        ctx.lineTo(leftPad, chartHeight + topPad);
        ctx.closePath();
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    // Draw each emotion as a line (with area fill for effect)
    drawLine(happyData, "#4ade80", "#4ade80"); // Green
    drawLine(neutralData, "#60a5fa", "#60a5fa"); // Blue
    drawLine(stressData, "#facc15", "#facc15"); // Yellow
    drawLine(sadData, "#94a3b8", "#94a3b8"); // Gray
    drawLine(angryData, "#f87171", "#f87171"); // Red

    // Draw legend
    const legendY = 15;
    const emotions = [
      { name: "Bahagia", color: "#4ade80" },
      { name: "Netral", color: "#60a5fa" },
      { name: "Stres", color: "#facc15" },
      { name: "Sedih", color: "#94a3b8" },
      { name: "Marah", color: "#f87171" },
    ];
    emotions.forEach((emotion, i) => {
      const x = 50 + i * 80;
      ctx.fillStyle = emotion.color;
      ctx.fillRect(x, legendY, 10, 10);
      ctx.fillStyle = "#666";
      ctx.font = "11px Arial";
      ctx.fillText(emotion.name, x + 15, legendY + 8);
    });
  }, [data]);

  if (!data || data.length === 0)
    return (
      <div className="text-xs text-muted-foreground">
        Belum ada data tren emosi.
      </div>
    );
  return (
    <div className="w-full h-[300px] relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full h-full"
      ></canvas>
    </div>
  );
}
