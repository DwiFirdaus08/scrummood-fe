import { PersonalSuggestions } from "@/components/personal-suggestions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, Brain, Heart, Target } from "lucide-react"

export default function PersonalInsightsPage() {
  // Mock data for personal statistics
  const personalStats = {
    weeklyMoodTrend: "improving",
    participationLevel: "moderate",
    stressLevel: "low",
    completedSuggestions: 12,
    pendingSuggestions: 3,
  }

  const emotionalPatterns = [
    { emotion: "Happy", percentage: 45, trend: "up" },
    { emotion: "Focused", percentage: 35, trend: "up" },
    { emotion: "Stressed", percentage: 15, trend: "down" },
    { emotion: "Confused", percentage: 5, trend: "stable" },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wawasan Pribadi</h1>
        <p className="text-muted-foreground">
          Dasbor kecerdasan emosional pribadi dan rekomendasi pengembangan untuk Anda
        </p>
      </div>

      {/* Statistik Pribadi */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Mingguan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Meningkat</div>
            <p className="text-xs text-muted-foreground">+12% dari minggu lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partisipasi</CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Sedang</div>
            <p className="text-xs text-muted-foreground">Ada ruang untuk perbaikan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Stres</CardTitle>
            <Heart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rendah</div>
            <p className="text-xs text-muted-foreground">Terelola dengan baik</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tujuan yang Diselesaikan</CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalStats.completedSuggestions}</div>
            <p className="text-xs text-muted-foreground">{personalStats.pendingSuggestions} tertunda</p>
          </CardContent>
        </Card>
      </div>

      {/* Pola Emosional */}
      <Card>
        <CardHeader>
          <CardTitle>Pola Emosional Anda</CardTitle>
          <CardDescription>Bagaimana emosi Anda terdistribusi selama seminggu terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emotionalPatterns.map((pattern) => (
              <div key={pattern.emotion} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{pattern.emotion}</span>
                  {getTrendIcon(pattern.trend)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${pattern.percentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{pattern.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saran Pribadi */}
      <PersonalSuggestions />
    </div>
  )
}
