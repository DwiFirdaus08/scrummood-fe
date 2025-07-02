"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Smile } from "lucide-react"

export type Message = {
  id: number
  sender: string
  senderInitials: string
  avatar: string
  content: string
  timestamp: string
  isSystem?: boolean
  emotion?: "neutral" | "happy" | "stressed" | "sad" | "angry"
}

interface MeetingChatProps {
  messages: Message[]
  onSend: (msg: string) => void
  user: { id: string; name: string }
}

export function MeetingChat({ messages, onSend, user }: MeetingChatProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    onSend(newMessage)
    setNewMessage("")
  }

  const getEmotionIndicator = (emotion?: Message["emotion"]) => {
    if (!emotion) return null

    const emotionMap = {
      happy: { emoji: "😊", color: "bg-green-100 text-green-800" },
      neutral: { emoji: "😐", color: "bg-blue-100 text-blue-800" },
      stressed: { emoji: "😓", color: "bg-yellow-100 text-yellow-800" },
      sad: { emoji: "😔", color: "bg-gray-100 text-gray-800" },
      angry: { emoji: "😠", color: "bg-red-100 text-red-800" },
    }

    const { emoji, color } = emotionMap[emotion]

    return (
      <div className={`text-xs px-1.5 py-0.5 rounded-full flex items-center ${color}`}>
        <span className="mr-1">{emoji}</span>
        <span className="capitalize">{emotion}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[400px] border rounded-lg overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isSystem ? "justify-center" : "gap-3"}`}>
              {message.isSystem ? (
                <div className="inline-block px-4 py-2 bg-blue-50 text-blue-800 text-sm rounded-lg max-w-[80%]">
                  <p>{message.content}</p>
                  <p className="text-xs text-blue-600 mt-1">{message.timestamp}</p>
                </div>
              ) : (
                <>
                  <Avatar>
                    <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                    <AvatarFallback>{message.senderInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{message.sender}</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                      {getEmotionIndicator(message.emotion)}
                    </div>
                    <div className="bg-gray-100 px-3 py-2 rounded-lg mt-1 text-sm">{message.content}</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Ketik pesan Anda..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            className="flex-shrink-0 bg-teal-600 hover:bg-teal-700"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
            Kirim
          </Button>
        </form>
      </div>
    </div>
  )
}
