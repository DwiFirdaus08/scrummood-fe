"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarPlus, Clock, Users, Video } from "lucide-react"
import { UpcomingScrums } from "@/components/upcoming-scrums"

export default function ScrumSchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

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
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="team">Tim</Label>
                    <Select>
                      <SelectTrigger id="team">
                        <SelectValue placeholder="Pilih tim" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend Team</SelectItem>
                        <SelectItem value="backend">Backend Team</SelectItem>
                        <SelectItem value="design">Design Team</SelectItem>
                        <SelectItem value="qa">QA Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Waktu Mulai</Label>
                      <Input id="start-time" type="time" defaultValue="09:00" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Durasi</Label>
                      <Select defaultValue="15">
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Pilih durasi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 menit</SelectItem>
                          <SelectItem value="15">15 menit</SelectItem>
                          <SelectItem value="20">20 menit</SelectItem>
                          <SelectItem value="30">30 menit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recurrence">Pengulangan</Label>
                    <Select defaultValue="weekdays">
                      <SelectTrigger id="recurrence">
                        <SelectValue placeholder="Pilih pengulangan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Sekali saja</SelectItem>
                        <SelectItem value="daily">Setiap hari</SelectItem>
                        <SelectItem value="weekdays">Hari kerja</SelectItem>
                        <SelectItem value="weekly">Mingguan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="participants">Peserta</Label>
                    <Select>
                      <SelectTrigger id="participants">
                        <SelectValue placeholder="Pilih peserta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua anggota tim</SelectItem>
                        <SelectItem value="developers">Hanya pengembang</SelectItem>
                        <SelectItem value="custom">Pilihan kustom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notification">Notifikasi</Label>
                    <Select defaultValue="15">
                      <SelectTrigger id="notification">
                        <SelectValue placeholder="Pilih waktu notifikasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 menit sebelum</SelectItem>
                        <SelectItem value="10">10 menit sebelum</SelectItem>
                        <SelectItem value="15">15 menit sebelum</SelectItem>
                        <SelectItem value="30">30 menit sebelum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Jadwalkan Sesi
                  </Button>
                </form>
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
