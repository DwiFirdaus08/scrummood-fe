"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Lock, User, Users } from "lucide-react"

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emotionTrackingEnabled, setEmotionTrackingEnabled] = useState(true)
  const [voiceAnalysisEnabled, setVoiceAnalysisEnabled] = useState(true)
  const [facialAnalysisEnabled, setFacialAnalysisEnabled] = useState(false)
  const [journalAnalysisEnabled, setJournalAnalysisEnabled] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola akun dan preferensi aplikasi Anda</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Lock className="mr-2 h-4 w-4" />
            Privasi
          </TabsTrigger>
          <TabsTrigger value="teams">
            <Users className="mr-2 h-4 w-4" />
            Tim
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pribadi</CardTitle>
                <CardDescription>Perbarui detail pribadi Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Ubah Avatar
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Surel</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Peran</Label>
                    <Select defaultValue="member">
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Pilih peran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Anggota Tim</SelectItem>
                        <SelectItem value="facilitator">Fasilitator</SelectItem>
                        <SelectItem value="manager">Manajer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Waktu</Label>
                    <Select defaultValue="utc-8">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Pilih zona waktu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Waktu Pasifik (UTC-8)</SelectItem>
                        <SelectItem value="utc-5">Waktu Timur (UTC-5)</SelectItem>
                        <SelectItem value="utc+0">UTC</SelectItem>
                        <SelectItem value="utc+1">Waktu Eropa Tengah (UTC+1)</SelectItem>
                        <SelectItem value="utc+8">Waktu Standar China (UTC+8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700">Simpan Perubahan</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keamanan Akun</CardTitle>
                <CardDescription>Perbarui kata sandi dan pengaturan keamanan Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Kata Sandi Baru</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <div className="pt-4 space-y-4">
                    <h3 className="font-medium">Autentikasi Dua Faktor</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa">Aktifkan 2FA</Label>
                        <p className="text-sm text-muted-foreground">Tambahkan lapisan keamanan ekstra ke akun Anda</p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700">Perbarui Pengaturan Keamanan</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Notifikasi</CardTitle>
              <CardDescription>Pilih cara dan waktu Anda ingin diberi tahu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Notifikasi Umum</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="all-notifications">Aktifkan Semua Notifikasi</Label>
                    <p className="text-sm text-muted-foreground">Pengatur utama untuk semua notifikasi</p>
                  </div>
                  <Switch
                    id="all-notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="scrum-reminders">Pengingat Sesi Scrum</Label>
                    <p className="text-sm text-muted-foreground">Dapatkan pemberitahuan sebelum sesi yang dijadwalkan</p>
                  </div>
                  <Switch id="scrum-reminders" disabled={!notificationsEnabled} defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emotion-alerts">Peringatan Emosi</Label>
                    <p className="text-sm text-muted-foreground">
                      Terima peringatan saat emosi tim berubah secara signifikan
                    </p>
                  </div>
                  <Switch id="emotion-alerts" disabled={!notificationsEnabled} defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="suggestion-notifications">Saran AI</Label>
                    <p className="text-sm text-muted-foreground">Dapatkan pemberitahuan tentang saran yang dihasilkan AI</p>
                  </div>
                  <Switch id="suggestion-notifications" disabled={!notificationsEnabled} defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Metode Pengiriman</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="in-app">Notifikasi Dalam Aplikasi</Label>
                    <p className="text-sm text-muted-foreground">Tampilkan notifikasi di dalam aplikasi</p>
                  </div>
                  <Switch id="in-app" disabled={!notificationsEnabled} defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email">Notifikasi Melalui Email</Label>
                    <p className="text-sm text-muted-foreground">Kirim notifikasi ke email Anda</p>
                  </div>
                  <Switch id="email" disabled={!notificationsEnabled} defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="desktop">Notifikasi Desktop</Label>
                    <p className="text-sm text-muted-foreground">Tampilkan notifikasi di desktop Anda</p>
                  </div>
                  <Switch id="desktop" disabled={!notificationsEnabled} defaultChecked />
                </div>
              </div>

              <Button className="bg-teal-600 hover:bg-teal-700">Simpan Pengaturan Notifikasi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Privasi</CardTitle>
              <CardDescription>Kontrol bagaimana data Anda dikumpulkan dan digunakan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Pelacakan Emosi</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emotion-tracking">Aktifkan Pelacakan Emosi</Label>
                    <p className="text-sm text-muted-foreground">Izinkan sistem untuk melacak keadaan emosional Anda</p>
                  </div>
                  <Switch
                    id="emotion-tracking"
                    checked={emotionTrackingEnabled}
                    onCheckedChange={setEmotionTrackingEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="text-analysis">Analisis Teks</Label>
                    <p className="text-sm text-muted-foreground">Analisis emosi dari pesan teks dan obrolan Anda</p>
                  </div>
                  <Switch id="text-analysis" disabled={!emotionTrackingEnabled} defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="voice-analysis">Analisis Suara</Label>
                    <p className="text-sm text-muted-foreground">Analisis emosi dari suara Anda selama sesi</p>
                  </div>
                  <Switch
                    id="voice-analysis"
                    checked={voiceAnalysisEnabled}
                    onCheckedChange={setVoiceAnalysisEnabled}
                    disabled={!emotionTrackingEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="facial-analysis">Analisis Ekspresi Wajah</Label>
                    <p className="text-sm text-muted-foreground">
                      Analisis emosi dari ekspresi wajah Anda (memerlukan kamera)
                    </p>
                  </div>
                  <Switch
                    id="facial-analysis"
                    checked={facialAnalysisEnabled}
                    onCheckedChange={setFacialAnalysisEnabled}
                    disabled={!emotionTrackingEnabled}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Privasi Jurnal</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="journal-analysis">Analisis Jurnal</Label>
                    <p className="text-sm text-muted-foreground">
                      Izinkan AI untuk menganalisis entri jurnal Anda untuk wawasan emosional
                    </p>
                  </div>
                  <Switch
                    id="journal-analysis"
                    checked={journalAnalysisEnabled}
                    onCheckedChange={setJournalAnalysisEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="journal-sharing">Berbagi Jurnal</Label>
                    <p className="text-sm text-muted-foreground">Bagikan wawasan jurnal yang dianonimkan dengan tim Anda</p>
                  </div>
                  <Switch id="journal-sharing" disabled={!journalAnalysisEnabled} defaultChecked={false} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Penyimpanan Data</h3>

                <div className="space-y-2">
                  <Label htmlFor="data-retention">Simpan Data Emosi Selama</Label>
                  <Select defaultValue="90">
                    <SelectTrigger id="data-retention">
                      <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 hari</SelectItem>
                      <SelectItem value="90">90 hari</SelectItem>
                      <SelectItem value="180">6 bulan</SelectItem>
                      <SelectItem value="365">1 tahun</SelectItem>
                      <SelectItem value="forever">Selamanya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  Hapus Semua Data Saya
                </Button>
              </div>

              <Button className="bg-teal-600 hover:bg-teal-700">Simpan Pengaturan Privasi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Tim</CardTitle>
              <CardDescription>Kelola tim dan keanggotaan tim Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Tim Anda</h3>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Tim Frontend</h4>
                        <p className="text-sm text-gray-500">5 anggota • Anda adalah anggota</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Tim Backend</h4>
                        <p className="text-sm text-gray-500">6 anggota • Anda adalah fasilitator</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Tim Desain</h4>
                        <p className="text-sm text-gray-500">4 anggota • Anda adalah anggota</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Buat Tim Baru</h3>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-name">Nama Tim</Label>
                    <Input id="team-name" placeholder="Masukkan nama tim" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team-description">Deskripsi</Label>
                    <Input id="team-description" placeholder="Deskripsi singkat tim" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team-members">Anggota Awal</Label>
                    <Input id="team-members" placeholder="Masukkan alamat email, dipisahkan dengan koma" />
                  </div>

                  <Button className="bg-teal-600 hover:bg-teal-700">Buat Tim</Button>
                </form>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Undangan Tim</h3>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-blue-800">Tim QA</h4>
                      <p className="text-sm text-blue-700">Diundang oleh: Sarah Williams • 2 hari yang lalu</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                        Tolak
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Terima
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
