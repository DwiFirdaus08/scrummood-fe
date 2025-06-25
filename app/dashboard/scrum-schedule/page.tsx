"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarPlus, Clock, Users, Video } from "lucide-react"
import { UpcomingScrums } from "@/components/upcoming-scrums"
import { fetchWithAuth } from "@/lib/api"

export default function ScrumSchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [userRole, setUserRole] = useState<string | null>(null)
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([])
  const [form, setForm] = useState({
    title: "",
    team_id: "",
    scheduled_start: "",
    scheduled_duration: "15",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Ambil role dan tim dari localStorage (hasil login)
    const profile = localStorage.getItem("user_profile")
    if (profile) {
      const user = JSON.parse(profile)
      setUserRole(user.role)
      setTeams(user.teams || [])
    }
  }, [])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await fetchWithAuth("https://backend.xeroon.xyz/api/sessions/create", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          team_id: Number(form.team_id),
          scheduled_duration: Number(form.scheduled_duration),
          scheduled_start: form.scheduled_start,
        }),
      })
      setSuccess("Sesi berhasil dibuat!")
      setForm({ title: "", team_id: "", scheduled_start: "", scheduled_duration: "15" })
    } catch (e: any) {
      setError(e.message || "Gagal membuat sesi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jadwal Scrum</h1>
        <p className="text-muted-foreground">Kelola dan jadwalkan sesi Daily Scrum Anda</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">Sesi Mendatang</TabsTrigger>
          <TabsTrigger value="schedule">Jadwalkan Sesi Baru</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Scrum Hari Ini</CardTitle>
              <CardDescription>Semua sesi yang dijadwalkan hari ini</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingScrums />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sesi Aktif</CardTitle>
                <CardDescription>Sesi Scrum yang sedang berjalan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-green-800">Frontend Team Daily Scrum</h3>
                      <p className="text-sm text-green-700">Started at 9:00 AM • 15 minutes duration</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-green-700">Live</span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-green-700 mb-2">
                    <Users className="mr-1 h-4 w-4" />5 participants
                  </div>

                  <div className="flex items-center text-sm text-green-700 mb-4">
                    <Clock className="mr-1 h-4 w-4" />
                    10 minutes elapsed
                  </div>

                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Video className="mr-1 h-4 w-4" />
                    Join Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jadwal Minggu Ini</CardTitle>
                <CardDescription>Ikhtisar semua sesi minggu ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium">Senin</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <div className="flex justify-between">
                        <span>Frontend Team</span>
                        <span>9:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Backend Team</span>
                        <span>10:00 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium">Selasa</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <div className="flex justify-between">
                        <span>Frontend Team</span>
                        <span>9:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Backend Team</span>
                        <span>10:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Design Team</span>
                        <span>11:00 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium">Rabu</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <div className="flex justify-between">
                        <span>Frontend Team</span>
                        <span>9:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Backend Team</span>
                        <span>10:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="schedule">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Jadwalkan Sesi Baru</CardTitle>
                <CardDescription>Buat sesi Daily Scrum baru</CardDescription>
              </CardHeader>
              <CardContent>
                {userRole === "facilitator" ? (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="title">Judul Sesi</Label>
                      <Input id="title" name="title" value={form.title} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="team_id">Tim</Label>
                      <select id="team_id" name="team_id" value={form.team_id} onChange={handleChange} required className="w-full border rounded px-2 py-1">
                        <option value="">Pilih tim</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_start">Waktu Mulai</Label>
                      <Input id="scheduled_start" name="scheduled_start" type="datetime-local" value={form.scheduled_start} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_duration">Durasi (menit)</Label>
                      <Input id="scheduled_duration" name="scheduled_duration" type="number" min="5" max="120" value={form.scheduled_duration} onChange={handleChange} required />
                    </div>
                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      {loading ? "Menyimpan..." : "Jadwalkan Sesi"}
                    </Button>
                    {success && <div className="text-green-600 mt-2">{success}</div>}
                    {error && <div className="text-red-600 mt-2">{error}</div>}
                  </form>
                ) : (
                  <div className="text-gray-500">Hanya fasilitator yang dapat membuat sesi baru.</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pilih Tanggal</CardTitle>
                <CardDescription>Pilih kapan untuk menjadwalkan sesi Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
