"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

type MoodData = {
  id: number
  name: string
  avatar: string
  initials: string
  mood: "happy" | "neutral" | "stressed" | "sad" | "angry"
  intensity: number
}

const teamData: MoodData[] = [
  { id: 1, name: "John Doe", avatar: "", initials: "JD", mood: "happy", intensity: 85 },
  { id: 2, name: "Jane Smith", avatar: "", initials: "JS", mood: "neutral", intensity: 60 },
  { id: 3, name: "Mike Johnson", avatar: "", initials: "MJ", mood: "stressed", intensity: 75 },
  { id: 4, name: "Sarah Williams", avatar: "", initials: "SW", mood: "happy", intensity: 90 },
  { id: 5, name: "Alex Brown", avatar: "", initials: "AB", mood: "sad", intensity: 45 },
]

const getMoodColor = (mood: MoodData["mood"]) => {
  switch (mood) {
    case "happy":
      return "bg-green-500"
    case "neutral":
      return "bg-blue-500"
    case "stressed":
      return "bg-yellow-500"
    case "sad":
      return "bg-gray-500"
    case "angry":
      return "bg-red-500"
  }
}

const getMoodEmoji = (mood: MoodData["mood"]) => {
  switch (mood) {
    case "happy":
      return "😊"
    case "neutral":
      return "😐"
    case "stressed":
      return "😓"
    case "sad":
      return "😔"
    case "angry":
      return "😠"
  }
}

export function TeamMoodSummary() {
  return (
    <div className="space-y-4">
      {teamData.map((member) => (
        <div key={member.id} className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
            <AvatarFallback>{member.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{member.name}</p>
              <span className="text-lg" aria-hidden="true">
                {getMoodEmoji(member.mood)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Progress value={member.intensity} className={`h-2 ${getMoodColor(member.mood)}`} />
              <span className="text-xs text-gray-500">{member.intensity}%</span>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium mb-2">Rata-rata Tim</h4>
        <div className="grid grid-cols-5 gap-2 text-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-lg mb-1">😊</div>
            <span className="text-xs">35%</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg mb-1">😐</div>
            <span className="text-xs">25%</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-lg mb-1">😓</div>
            <span className="text-xs">20%</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg mb-1">😔</div>
            <span className="text-xs">15%</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-lg mb-1">😠</div>
            <span className="text-xs">5%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
