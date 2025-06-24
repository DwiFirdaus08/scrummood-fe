"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Target, Lightbulb, Heart, MessageCircle, TrendingUp } from "lucide-react"

interface PersonalSuggestionsProps {
  source?: "meeting" | "journal" | "all"
}

export function PersonalSuggestions({ source = "all" }: PersonalSuggestionsProps) {
  const [suggestions] = useState({
    actionItems: [
      {
        id: 1,
        title: "Latihan mendengarkan aktif",
        description: "Berdasarkan analisis rapat, cobalah lebih banyak bertanya klarifikasi saat diskusi",
        priority: "high",
        source: "meeting",
        completed: false,
      },
      {
        id: 2,
        title: "Ambil istirahat secara teratur",
        description: "Entri jurnal Anda menunjukkan pola stres. Jadwalkan istirahat 5 menit setiap jam",
        priority: "medium",
        source: "journal",
        completed: false,
      },
      {
        id: 3,
        title: "Bagikan ide dengan lebih percaya diri",
        description: "Anda punya banyak wawasan bagus tapi tampak ragu membagikannya di rapat",
        priority: "high",
        source: "meeting",
        completed: false,
      },
    ],
    strengths: [
      {
        id: 4,
        title: "Kemampuan pemecahan masalah yang hebat",
        description: "Anda konsisten memberikan solusi kreatif saat diskusi tim",
        source: "meeting",
      },
      {
        id: 5,
        title: "Menjaga sikap positif",
        description: "Jurnal Anda menunjukkan ketahanan dan optimisme bahkan di masa sulit",
        source: "journal",
      },
    ],
    completed: [
      {
        id: 6,
        title: "Partisipasi rapat meningkat",
        description: "Kemajuan besar dalam berani berbicara di rapat tim",
        completedDate: "2024-01-10",
        source: "meeting",
      },
    ],
  })

  const filteredSuggestions = {
    actionItems: suggestions.actionItems.filter((s) => source === "all" || s.source === source),
    strengths: suggestions.strengths.filter((s) => source === "all" || s.source === source),
    completed: suggestions.completed.filter((s) => source === "all" || s.source === source),
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "meeting":
        return <MessageCircle className="h-4 w-4" />
      case "journal":
        return <Heart className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  return (
    <Tabs defaultValue="action-items" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="action-items" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Tugas Aksi ({filteredSuggestions.actionItems.length})
        </TabsTrigger>
        <TabsTrigger value="strengths" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Kekuatan ({filteredSuggestions.strengths.length})
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Selesai ({filteredSuggestions.completed.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="action-items" className="space-y-4">
        {filteredSuggestions.actionItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Tidak ada tugas aksi dari {source === "all" ? "sumber manapun" : source}</p>
          </div>
        ) : (
          filteredSuggestions.actionItems.map((item) => (
            <Card key={item.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSourceIcon(item.source)}
                      <h3 className="font-medium">{item.title}</h3>
                      <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Dari {item.source === "meeting" ? "rapat" : item.source === "journal" ? "jurnal" : item.source}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Tandai Selesai
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="strengths" className="space-y-4">
        {filteredSuggestions.strengths.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Tidak ada kekuatan yang teridentifikasi dari {source === "all" ? "sumber manapun" : source}</p>
          </div>
        ) : (
          filteredSuggestions.strengths.map((item) => (
            <Card key={item.id} className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  {getSourceIcon(item.source)}
                  <div className="flex-1">
                    <h3 className="font-medium text-green-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <Badge variant="outline" className="text-xs">
                      Dari {item.source === "meeting" ? "rapat" : item.source === "journal" ? "jurnal" : item.source}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        {filteredSuggestions.completed.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Tidak ada tugas selesai dari {source === "all" ? "sumber manapun" : source}</p>
          </div>
        ) : (
          filteredSuggestions.completed.map((item) => (
            <Card key={item.id} className="border-l-4 border-l-gray-400 opacity-75">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium line-through text-gray-600">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Dari {item.source === "meeting" ? "rapat" : item.source === "journal" ? "jurnal" : item.source}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Selesai {item.completedDate}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}
