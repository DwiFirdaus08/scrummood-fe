"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Clock, Download, Eye, Calendar, Users, User } from "lucide-react"

type SessionHistoryProps = {
  team?: string
}

type Session = {
  id: number
  team: string
  date: string
  time: string
  duration: string
  participants: number
  emotionSummary: {
    happy: number
    neutral: number
    stressed: number
    sad: number
    angry: number
  }
}

const sessions: Session[] = [
  {
    id: 1,
    team: "Tim Frontend",
    date: "2023-04-28",
    time: "09.00",
    duration: "15 menit",
    participants: 5,
    emotionSummary: {
      happy: 60,
      neutral: 25,
      stressed: 10,
      sad: 3,
      angry: 2,
    },
  },
  {
    id: 2,
    team: "Tim Backend",
    date: "2023-04-28",
    time: "10.00",
    duration: "20 menit",
    participants: 6,
    emotionSummary: {
      happy: 45,
      neutral: 30,
      stressed: 15,
      sad: 5,
      angry: 5,
    },
  },
  {
    id: 3,
    team: "Tim Desain",
    date: "2023-04-28",
    time: "11.00",
    duration: "15 menit",
    participants: 4,
    emotionSummary: {
      happy: 70,
      neutral: 20,
      stressed: 5,
      sad: 5,
      angry: 0,
    },
  },
  {
    id: 4,
    team: "Tim Frontend",
    date: "2023-04-27",
    time: "09.00",
    duration: "15 menit",
    participants: 5,
    emotionSummary: {
      happy: 55,
      neutral: 25,
      stressed: 15,
      sad: 3,
      angry: 2,
    },
  },
  {
    id: 5,
    team: "Tim Backend",
    date: "2023-04-27",
    time: "10.00",
    duration: "15 menit",
    participants: 6,
    emotionSummary: {
      happy: 40,
      neutral: 30,
      stressed: 20,
      sad: 5,
      angry: 5,
    },
  },
]

export function SessionHistory({ team }: SessionHistoryProps) {
  const filteredSessions = team
    ? sessions.filter((session) => session.team.toLowerCase().includes(team.toLowerCase()))
    : sessions

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("id-ID", { month: "short" }),
      year: date.getFullYear(),
      weekday: date.toLocaleDateString("id-ID", { weekday: "short" }),
    }
  }

  return (
    <div className="space-y-6">
      {filteredSessions.map((session) => {
        const dateInfo = formatDate(session.date)

        return (
          <div
            key={session.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div className="flex gap-4">
                  {/* Date Badge */}
                  <div className="flex-shrink-0">
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-center min-w-[80px]">
                      <div className="text-xs text-teal-600 font-medium uppercase">{dateInfo.month}</div>
                      <div className="text-2xl font-bold text-teal-700">{dateInfo.day}</div>
                      <div className="text-xs text-teal-600">{dateInfo.year}</div>
                    </div>
                  </div>

                  {/* Session Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{session.team}</h3>
                      <Badge variant="outline" className="text-xs">
                        {dateInfo.weekday}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{session.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{session.participants} anggota</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 lg:flex-col lg:min-w-[140px]">
                  <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                    <BarChart className="mr-2 h-4 w-4" />
                    Analitik
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                    <Download className="mr-2 h-4 w-4" />
                    Ekspor
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                    <User className="mr-2 h-4 w-4" />
                    Wawasan Pribadi
                  </Button>
                </div>
              </div>

              {/* Emotion Summary Section */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Ringkasan Emosi</h4>
                  <div className="text-xs text-gray-500">
                    Dominan: {session.emotionSummary.happy >= 50
                      ? "Bahagia"
                      : session.emotionSummary.neutral >= 40
                        ? "Netral"
                        : session.emotionSummary.stressed >= 30
                          ? "Stres"
                          : "Campuran"}
                  </div>
                </div>

                {/* Emotion Progress Bar */}
                <div className="w-full h-4 rounded-full overflow-hidden bg-gray-100 mb-3">
                  <div className="h-full flex">
                    <div
                      className="bg-green-500 transition-all duration-300"
                      style={{ width: `${session.emotionSummary.happy}%` }}
                      title={`Happy: ${session.emotionSummary.happy}%`}
                    ></div>
                    <div
                      className="bg-blue-500 transition-all duration-300"
                      style={{ width: `${session.emotionSummary.neutral}%` }}
                      title={`Neutral: ${session.emotionSummary.neutral}%`}
                    ></div>
                    <div
                      className="bg-yellow-500 transition-all duration-300"
                      style={{ width: `${session.emotionSummary.stressed}%` }}
                      title={`Stressed: ${session.emotionSummary.stressed}%`}
                    ></div>
                    <div
                      className="bg-gray-500 transition-all duration-300"
                      style={{ width: `${session.emotionSummary.sad}%` }}
                      title={`Sad: ${session.emotionSummary.sad}%`}
                    ></div>
                    <div
                      className="bg-red-500 transition-all duration-300"
                      style={{ width: `${session.emotionSummary.angry}%` }}
                      title={`Angry: ${session.emotionSummary.angry}%`}
                    ></div>
                  </div>
                </div>

                {/* Emotion Legend */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Bahagia ({session.emotionSummary.happy}%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600">Netral ({session.emotionSummary.neutral}%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-600">Stres ({session.emotionSummary.stressed}%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-gray-600">Sedih ({session.emotionSummary.sad}%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">Marah ({session.emotionSummary.angry}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
