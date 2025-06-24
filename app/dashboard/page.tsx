import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmotionChart } from "@/components/emotion-chart"
import { TeamMoodSummary } from "@/components/team-mood-summary"
import { RecentSuggestions } from "@/components/recent-suggestions"
import { UpcomingScrums } from "@/components/upcoming-scrums"
import { Clock, Video, TrendingUp, Users, Calendar, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Dasbor</h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang kembali! Pantau kesehatan emosional tim Anda dan sesi yang akan datang.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/dashboard/meeting">
            <Button className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
              <Video className="mr-2 h-4 w-4" /> Gabung Meeting Aktif
            </Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto">
            <Clock className="mr-2 h-4 w-4" /> Lihat Sesi Sebelumnya
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesi Aktif</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Daily Scrum Tim Frontend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Tim</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Netral</div>
            <p className="text-xs text-muted-foreground">+2% dari kemarin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scrum Mendatang</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Berikutnya: Tim Backend (10:00 AM)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saran</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 baru sejak kemarin</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tren Emosi Tim</CardTitle>
            <CardDescription>Pola emosional selama 7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <EmotionChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Tim Saat Ini</CardTitle>
            <CardDescription>Keadaan emosional waktu nyata</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamMoodSummary />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - 3 Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Saran Tim
            </CardTitle>
            <CardDescription>Rekomendasi AI untuk tim</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            <RecentSuggestions />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sesi Mendatang
            </CardTitle>
            <CardDescription>Scrum Harian Anda yang dijadwalkan</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            <UpcomingScrums />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Wawasan Pribadi
            </CardTitle>
            <CardDescription>Rekomendasi yang dipersonalisasi untuk Anda</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-sm text-blue-800">Latihan Mendengarkan Aktif</h4>
                <p className="text-xs text-blue-700 mt-1">Cobalah untuk lebih banyak mengajukan pertanyaan klarifikasi selama diskusi</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-blue-600">Dari rapat</span>
                  <Button size="sm" variant="outline" className="text-xs h-6">
                    Tandai Selesai
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-sm text-green-800">Pemecahan Masalah yang Hebat</h4>
                <p className="text-xs text-green-700 mt-1">Pendekatan analitis Anda sangat baik hari ini</p>
                <span className="text-xs text-green-600">Dari rapat</span>
              </div>

              <div className="text-center pt-2">
                <Link href="/dashboard/personal-insights">
                  <Button variant="outline" size="sm" className="text-xs">
                    Lihat Semua Wawasan
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
