"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Target, Lightbulb, Heart, MessageCircle, TrendingUp } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"

interface PersonalSuggestionsProps {
  source?: "meeting" | "journal" | "all"
}

export function PersonalSuggestions({ source = "all" }: PersonalSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSuggestions() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchWithAuth("https://backend.xeroon.xyz/api/suggestions/personal")
        setSuggestions(res)
      } catch (e: any) {
        setError(e.message || "Gagal mengambil data saran")
      } finally {
        setLoading(false)
      }
    }
    fetchSuggestions()
  }, [])

  if (loading) return <div>Memuat saran pribadi...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!suggestions || !suggestions.suggestions || suggestions.suggestions.length === 0) return <div>Tidak ada saran ditemukan.</div>

  return (
    <div>
      {suggestions.suggestions.map((item: any) => (
        <Card key={item.id} className="mb-4">
          <CardContent>
            <div className="font-bold">{item.title}</div>
            <div className="text-sm text-muted-foreground mb-2">{item.description}</div>
            <Badge>{item.suggestion_type}</Badge>
            {item.priority && <Badge variant="outline">Prioritas: {item.priority}</Badge>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
