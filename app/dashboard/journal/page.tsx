"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { JournalEntries } from "@/components/journal-entries"
import { JournalAnalysis } from "@/components/journal-analysis"
import { PersonalSuggestions } from "@/components/personal-suggestions"
import { Save, Brain, TrendingUp, Calendar, BookOpen } from "lucide-react"

export default function JournalPage() {
  const [journalText, setJournalText] = useState("")
  const [selectedMood, setSelectedMood] = useState("")

  const moods = [
    { emoji: "😊", label: "Happy", color: "bg-green-50 border-green-200 text-green-800" },
    { emoji: "😐", label: "Neutral", color: "bg-blue-50 border-blue-200 text-blue-800" },
    { emoji: "😰", label: "Stressed", color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
    { emoji: "😢", label: "Sad", color: "bg-gray-50 border-gray-200 text-gray-800" },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jurnal Harian</h1>
        <p className="text-muted-foreground mt-1">Refleksikan pengalaman harian Anda dan lacak perjalanan emosi Anda</p>
      </div>

      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="write" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Tulis Jurnal
          </TabsTrigger>
          <TabsTrigger value="entries" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Entri Sebelumnya
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Analisis AI
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Wawasan Pribadi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Journal Writing Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    New Journal Entry
                  </CardTitle>
                  <CardDescription>Write about your day, feelings, and experiences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">How are you feeling today?</label>
                    <div className="flex flex-wrap gap-2">
                      {moods.map((mood) => (
                        <Badge
                          key={mood.label}
                          variant="outline"
                          className={`cursor-pointer hover:shadow-md transition-all ${
                            selectedMood === mood.label ? mood.color : ""
                          }`}
                          onClick={() => setSelectedMood(mood.label)}
                        >
                          <span className="mr-1">{mood.emoji}</span>
                          {mood.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Journal Entry</label>
                    <Textarea
                      placeholder="Write about your day, what went well, what challenges you faced, and how you're feeling..."
                      className="min-h-[200px] resize-none"
                      value={journalText}
                      onChange={(e) => setJournalText(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="analyze" className="rounded border-gray-300" />
                    <label htmlFor="analyze" className="text-sm text-gray-700">
                      Allow AI to analyze this entry for emotional insights
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1">
                      Save as Draft
                    </Button>
                    <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                      <Save className="mr-2 h-4 w-4" />
                      Save Entry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Emotion Analysis
                  </CardTitle>
                  <CardDescription>Real-time insights as you write</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Current Sentiment</h3>
                    <p className="text-sm text-blue-700">
                      {journalText.length > 50
                        ? "Your writing shows a balanced emotional state with some positive elements."
                        : "Start writing to see AI analysis of your emotional state."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Positive Sentiment</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                        <span className="text-sm">75%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Stress Level</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                        <span className="text-sm">30%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Clarity</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                        </div>
                        <span className="text-sm">80%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="font-medium text-sm mb-2">Writing Tips</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Be specific about your feelings</li>
                      <li>• Describe what triggered emotions</li>
                      <li>• Note what you learned today</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="entries">
          <Card>
            <CardHeader>
              <CardTitle>Journal History</CardTitle>
              <CardDescription>Your past reflection entries</CardDescription>
            </CardHeader>
            <CardContent>
              <JournalEntries />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Emotional Analysis</CardTitle>
              <CardDescription>AI-powered insights from your journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <JournalAnalysis />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Personal Insights from Journal</CardTitle>
              <CardDescription>AI-generated suggestions based on your journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalSuggestions source="journal" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
