"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Video, VideoOff, MoreHorizontal } from "lucide-react"

type Participant = {
  id: number
  name: string
  initials: string
  avatar: string
  role: string
  isSpeaking: boolean
  isMuted: boolean
  isVideoOn: boolean
  isScreenSharing: boolean
  joinTime: string
  dominantEmotion: "happy" | "neutral" | "stressed" | "sad" | "angry"
}

const participants: Participant[] = [
  {
    id: 1,
    name: "Budi Santoso (Anda)",
    initials: "BS",
    avatar: "",
    role: "Anggota Tim",
    isSpeaking: true,
    isMuted: false,
    isVideoOn: true,
    isScreenSharing: false,
    joinTime: "09.00",
    dominantEmotion: "happy",
  },
  {
    id: 2,
    name: "Siti Aminah",
    initials: "SA",
    avatar: "",
    role: "Ketua Tim",
    isSpeaking: false,
    isMuted: false,
    isVideoOn: true,
    isScreenSharing: false,
    joinTime: "08.58",
    dominantEmotion: "neutral",
  },
  {
    id: 3,
    name: "Andi Wijaya",
    initials: "AW",
    avatar: "",
    role: "Pengembang",
    isSpeaking: false,
    isMuted: false,
    isVideoOn: true,
    isScreenSharing: false,
    joinTime: "09.01",
    dominantEmotion: "stressed",
  },
  {
    id: 4,
    name: "Rina Dewi",
    initials: "RD",
    avatar: "",
    role: "Desainer",
    isSpeaking: false,
    isMuted: true,
    isVideoOn: false,
    isScreenSharing: false,
    joinTime: "09.02",
    dominantEmotion: "happy",
  },
]

export function LiveParticipants() {
  const getEmotionEmoji = (emotion: Participant["dominantEmotion"]) => {
    switch (emotion) {
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

  const getEmotionColor = (emotion: Participant["dominantEmotion"]) => {
    switch (emotion) {
      case "happy":
        return "bg-green-100 text-green-800"
      case "neutral":
        return "bg-blue-100 text-blue-800"
      case "stressed":
        return "bg-yellow-100 text-yellow-800"
      case "sad":
        return "bg-gray-100 text-gray-800"
      case "angry":
        return "bg-red-100 text-red-800"
    }
  }

  const getEmotionLabel = (emotion: Participant["dominantEmotion"]) => {
    switch (emotion) {
      case "happy":
        return "Senang"
      case "neutral":
        return "Netral"
      case "stressed":
        return "Stres"
      case "sad":
        return "Sedih"
      case "angry":
        return "Marah"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">4 Peserta</div>
        <Button size="sm" variant="outline">
          Undang
        </Button>
      </div>

      <div className="space-y-3">
        {participants.map((participant) => (
          <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                  <AvatarFallback>{participant.initials}</AvatarFallback>
                </Avatar>
                {participant.isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                )}
              </div>

              <div>
                <div className="font-medium flex items-center">
                  {participant.name}
                  {participant.id === 1 && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Anda
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-2">
                  <span>{participant.role}</span>
                  <span>•</span>
                  <span>Bergabung {participant.joinTime}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={`text-xs px-1.5 py-0.5 rounded-full flex items-center ${getEmotionColor(participant.dominantEmotion)}`}
              >
                <span className="mr-1">{getEmotionEmoji(participant.dominantEmotion)}</span>
                <span className="capitalize">{getEmotionLabel(participant.dominantEmotion)}</span>
              </div>

              {participant.isMuted ? (
                <MicOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Mic className="h-4 w-4 text-gray-600" />
              )}

              {participant.isVideoOn ? (
                <Video className="h-4 w-4 text-gray-600" />
              ) : (
                <VideoOff className="h-4 w-4 text-gray-400" />
              )}

              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
