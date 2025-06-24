"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Brain, Users, TrendingUp, Clock } from "lucide-react"
import io, { Socket } from "socket.io-client"

interface EmotionData {
  happy: number
  sad: number
  angry: number
  fearful: number
  disgusted: number
  surprised: number
  neutral: number
}

interface LiveEmotionTrackerProps {
  currentUserEmotions?: EmotionData
  currentUserFaceDetected?: boolean
}

export function LiveEmotionTracker({ currentUserEmotions, currentUserFaceDetected }: LiveEmotionTrackerProps) {
  const socketRef = useRef<Socket | null>(null)
  const [teamEmotions, setTeamEmotions] = useState([
    {
      id: "user-1",
      name: "John Doe (Anda)",
      avatar: "JD",
      emotions: currentUserEmotions || {
        happy: 0.7,
        neutral: 0.2,
        surprised: 0.05,
        sad: 0.03,
        angry: 0.01,
        fearful: 0.005,
        disgusted: 0.005,
      },
      faceDetected: currentUserFaceDetected || false,
      isCurrentUser: true,
    },
    {
      id: "user-2",
      name: "Jane Smith",
      avatar: "JS",
      emotions: {
        happy: 0.6,
        neutral: 0.25,
        surprised: 0.08,
        sad: 0.04,
        angry: 0.02,
        fearful: 0.005,
        disgusted: 0.005,
      },
      faceDetected: true,
      isCurrentUser: false,
    },
    {
      id: "user-3",
      name: "Mike Johnson",
      avatar: "MJ",
      emotions: {
        happy: 0.3,
        neutral: 0.4,
        surprised: 0.1,
        sad: 0.15,
        angry: 0.03,
        fearful: 0.01,
        disgusted: 0.01,
      },
      faceDetected: true,
      isCurrentUser: false,
    },
    {
      id: "user-4",
      name: "Sarah Wilson",
      avatar: "SW",
      emotions: {
        happy: 0.8,
        neutral: 0.15,
        surprised: 0.03,
        sad: 0.01,
        angry: 0.005,
        fearful: 0.003,
        disgusted: 0.002,
      },
      faceDetected: false,
      isCurrentUser: false,
    },
  ])

  // Update current user emotions when props change
  useEffect(() => {
    if (currentUserEmotions) {
      setTeamEmotions((prev) =>
        prev.map((member) =>
          member.isCurrentUser
            ? {
                ...member,
                emotions: currentUserEmotions,
                faceDetected: currentUserFaceDetected || false,
              }
            : member,
        ),
      )
    }
  }, [currentUserEmotions, currentUserFaceDetected])

  // --- SOCKET.IO REAL-TIME EMOTION TRACKING ---
  useEffect(() => {
    // Connect to backend Socket.IO server
    if (!socketRef.current) {
      // Ganti URL di bawah sesuai backend Anda
      socketRef.current = io("http://localhost:5000", {
        transports: ["websocket"],
        query: {
          token: localStorage.getItem("access_token") || "",
        },
      })
    }
    const socket = socketRef.current

    // Join session room (ganti session_id sesuai kebutuhan)
    const sessionId = localStorage.getItem("current_session_id") || "1"
    socket.emit("join_session", { session_id: sessionId })

    // Listen for real-time emotion updates
    socket.on("emotion_update", (payload) => {
      // payload: { session_id, user_id, emotion }
      setTeamEmotions((prev) => {
        // Cari user yang sesuai, update emosi dan faceDetected=true
        const found = prev.find((m) => m.id === payload.user_id || m.id === `user-${payload.user_id}`)
        if (found) {
          return prev.map((m) =>
            m.id === found.id
              ? {
                  ...m,
                  emotions: payload.emotion,
                  faceDetected: true,
                }
              : m,
          )
        } else {
          // Tambahkan user baru jika belum ada
          return [
            ...prev,
            {
              id: payload.user_id,
              name: payload.username || `User ${payload.user_id}`,
              avatar: payload.username ? payload.username.slice(0, 2).toUpperCase() : payload.user_id,
              emotions: payload.emotion,
              faceDetected: true,
              isCurrentUser: false,
            },
          ]
        }
      })
    })

    // Listen for user join/leave events (opsional, update presence)
    socket.on("user_joined", (payload) => {
      // Tambahkan user ke teamEmotions jika belum ada
      setTeamEmotions((prev) => {
        if (prev.some((m) => m.id === payload.user_id || m.id === `user-${payload.user_id}`)) return prev
        return [
          ...prev,
          {
            id: payload.user_id,
            name: payload.username || `User ${payload.user_id}`,
            avatar: payload.username ? payload.username.slice(0, 2).toUpperCase() : payload.user_id,
            emotions: { happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0, neutral: 1 },
            faceDetected: false,
            isCurrentUser: false,
          },
        ]
      })
    })
    socket.on("user_left", (payload) => {
      setTeamEmotions((prev) =>
        prev.map((m) =>
          m.id === payload.user_id || m.id === `user-${payload.user_id}` ? { ...m, faceDetected: false } : m,
        ),
      )
    })

    return () => {
      socket.emit("leave_session", { session_id: sessionId })
      socket.disconnect()
    }
  }, [])

  const getEmotionColor = (emotion: string) => {
    const colors = {
      happy: "bg-green-500",
      neutral: "bg-blue-500",
      surprised: "bg-purple-500",
      sad: "bg-gray-500",
      angry: "bg-red-500",
      fearful: "bg-orange-500",
      disgusted: "bg-yellow-500",
    }
    return colors[emotion as keyof typeof colors] || "bg-gray-400"
  }

  const getEmotionIcon = (emotion: string) => {
    const icons = {
      happy: "😊",
      neutral: "😐",
      surprised: "😲",
      sad: "😢",
      angry: "😠",
      fearful: "😨",
      disgusted: "🤢",
    }
    return icons[emotion as keyof typeof icons] || "😐"
  }

  const getDominantEmotion = (emotions: EmotionData) => {
    return Object.entries(emotions).reduce((a, b) =>
      emotions[a[0] as keyof EmotionData] > emotions[b[0] as keyof EmotionData] ? a : b,
    )
  }

  const calculateTeamAverage = () => {
    const activeMembers = teamEmotions.filter((member) => member.faceDetected)
    if (activeMembers.length === 0) return null

    const averageEmotions: EmotionData = {
      happy: 0,
      sad: 0,
      angry: 0,
      fearful: 0,
      disgusted: 0,
      surprised: 0,
      neutral: 0,
    }

    activeMembers.forEach((member) => {
      Object.keys(averageEmotions).forEach((emotion) => {
        averageEmotions[emotion as keyof EmotionData] += member.emotions[emotion as keyof EmotionData]
      })
    })

    Object.keys(averageEmotions).forEach((emotion) => {
      averageEmotions[emotion as keyof EmotionData] /= activeMembers.length
    })

    return averageEmotions
  }

  const teamAverage = calculateTeamAverage()
  const activeMembersCount = teamEmotions.filter((member) => member.faceDetected).length

  return (
    <div className="space-y-4">
      {/* Team Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Analisis Emosi Langsung
              </CardTitle>
              <CardDescription>Deteksi emosi AI secara waktu nyata</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Users className="mr-1 h-3 w-3" />
                {activeMembersCount} Aktif
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                <TrendingUp className="mr-1 h-3 w-3" />
                Didukung AI
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {teamAverage ? (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Keadaan Emosi Tim</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(teamAverage)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 4)
                  .map(([emotion, value]) => (
                    <div key={emotion} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEmotionIcon(emotion)}</span>
                        <span className="text-sm font-medium capitalize">{emotion}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={value * 100} className="w-16 h-2" />
                        <span className="text-xs font-medium w-8">{Math.round(value * 100)}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aktifkan kamera untuk deteksi emosi AI</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamEmotions.map((member) => {
          const dominantEmotion = getDominantEmotion(member.emotions)
          return (
            <Card
              key={member.id}
              className={`${member.isCurrentUser ? "border-2 border-purple-200 bg-purple-50/30" : ""} ${
                !member.faceDetected ? "opacity-60" : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm">{member.name}</h4>
                      <div className="flex items-center gap-1">
                        {member.faceDetected ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                            AI Aktif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-500 text-xs">
                            Tidak Ada Wajah
                          </Badge>
                        )}
                        {member.isCurrentUser && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                            Anda
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {member.faceDetected && (
                    <div className="text-right">
                      <div className="text-lg">{getEmotionIcon(dominantEmotion[0])}</div>
                      <div className="text-xs text-muted-foreground">{Math.round(dominantEmotion[1] * 100)}%</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {member.faceDetected ? (
                  <div className="space-y-2">
                    {Object.entries(member.emotions)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([emotion, value]) => (
                        <div key={emotion} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{getEmotionIcon(emotion)}</span>
                            <span className="text-xs capitalize">{emotion}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`${getEmotionColor(emotion)} h-1.5 rounded-full transition-all duration-300`}
                                style={{ width: `${value * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs w-6 text-right">{Math.round(value * 100)}%</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-2 text-muted-foreground">
                    <p className="text-xs">Kamera tidak aktif</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Insight Waktu Nyata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {activeMembersCount > 0 ? (
              <>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                  🤖 {activeMembersCount} anggota tim sedang dipantau oleh deteksi emosi AI
                </div>
                {teamAverage && teamAverage.happy > 0.6 && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                    ✨ Mood tim sangat positif! Waktu yang tepat untuk diskusi kreatif.
                  </div>
                )}
                {teamAverage && teamAverage.sad > 0.3 && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                    ⚠️ Beberapa anggota tim tampak stres. Pertimbangkan untuk istirahat sejenak.
                  </div>
                )}
                {currentUserFaceDetected && currentUserEmotions && (
                  <div className="p-2 bg-purple-50 border border-purple-200 rounded text-xs text-purple-700">
                    👤 Emosi Anda: {getDominantEmotion(currentUserEmotions)[0]} (
                    {Math.round(getDominantEmotion(currentUserEmotions)[1] * 100)}%)
                  </div>
                )}
              </>
            ) : (
              <div className="p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                💡 Aktifkan kamera untuk memulai analisis emosi berbasis AI
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
