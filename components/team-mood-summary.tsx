"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import React from "react";

type MoodData = {
  id: number | string;
  name: string;
  avatar?: string;
  initials?: string;
  mood: "happy" | "neutral" | "stressed" | "sad" | "angry";
  intensity: number;
};

type TeamMoodSummaryProps = {
  data: MoodData[];
  summary?: Record<string, number>;
};

const getMoodColor = (mood: MoodData["mood"]) => {
  switch (mood) {
    case "happy":
      return "bg-green-500";
    case "neutral":
      return "bg-blue-500";
    case "stressed":
      return "bg-yellow-500";
    case "sad":
      return "bg-gray-500";
    case "angry":
      return "bg-red-500";
  }
};

const getMoodEmoji = (mood: MoodData["mood"]) => {
  switch (mood) {
    case "happy":
      return "😊";
    case "neutral":
      return "😐";
    case "stressed":
      return "😓";
    case "sad":
      return "😔";
    case "angry":
      return "😠";
  }
};

export function TeamMoodSummary({ data, summary }: TeamMoodSummaryProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-xs text-muted-foreground">
        Belum ada data mood tim.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {data.map((member) => (
        <div key={member.id} className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={member.avatar || "/placeholder.svg"}
              alt={member.name}
            />
            <AvatarFallback>
              {member.initials ||
                (member.name
                  ? member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{member.name}</p>
              <span className="text-lg" aria-hidden="true">
                {getMoodEmoji(member.mood)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Progress
                value={member.intensity}
                className={`h-2 ${getMoodColor(member.mood)}`}
              />
              <span className="text-xs text-gray-500">{member.intensity}%</span>
            </div>
          </div>
        </div>
      ))}

      {summary && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Rata-rata Tim</h4>
          <div className="grid grid-cols-5 gap-2 text-center">
            {Object.entries(summary)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([emo, val]) => (
                <div key={emo} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-lg mb-1 ${getMoodColor(
                      emo as MoodData["mood"]
                    )}`}
                  >
                    {getMoodEmoji(emo as MoodData["mood"])}
                  </div>
                  <span className="text-xs">
                    {Math.round((val as number) * 100)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
