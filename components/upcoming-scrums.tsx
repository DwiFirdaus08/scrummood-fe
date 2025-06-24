"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Video } from "lucide-react"

type ScrumSession = {
  id: number
  team: string
  time: string
  participants: number
  status: "upcoming" | "active" | "completed"
}

const scrumSessions: ScrumSession[] = [
  {
    id: 1,
    team: "Tim Backend",
    time: "10.00 - 10.15",
    participants: 6,
    status: "upcoming",
  },
  {
    id: 2,
    team: "Tim Desain",
    time: "11.00 - 11.15",
    participants: 4,
    status: "upcoming",
  },
  {
    id: 3,
    team: "Tim QA",
    time: "12.00 - 12.15",
    participants: 5,
    status: "upcoming",
  },
]

export function UpcomingScrums() {
  return (
    <div className="space-y-4">
      {scrumSessions.map((session) => (
        <div key={session.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
          <div className="space-y-1">
            <p className="font-medium">{session.team}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-1 h-4 w-4" />
              {session.time}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="mr-1 h-4 w-4" />
              {session.participants} anggota
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <Calendar className="mr-1 h-4 w-4" />
              Jadwalkan
            </Button>
            <Button size="sm" className="h-8 bg-teal-600 hover:bg-teal-700">
              <Video className="mr-1 h-4 w-4" />
              Gabung
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
