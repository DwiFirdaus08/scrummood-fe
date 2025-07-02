"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, Clock, Users, Video } from "lucide-react";
import { UpcomingScrums } from "@/components/upcoming-scrums";
import { fetchWithAuth } from "@/lib/api";
import { fetchUserProfile } from "@/lib/user-api";
import { useToast } from "@/hooks/use-toast";

// Helper: convert 'YYYY-MM-DDTHH:mm' (from datetime-local) to ISO string with local offset
function toLocalISOString(dtStr: string) {
  if (!dtStr) return "";
  const date = new Date(dtStr);
  // Get timezone offset in minutes
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? "+" : "-";
  const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
  const offset = `${diff}${pad(tzOffset / 60)}:${pad(tzOffset % 60)}`;
  return date.toISOString().slice(0, 19) + offset;
}

export default function ScrumSchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [userRole, setUserRole] = useState<string | null>(null);
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    title: "",
    scheduled_start: "",
    scheduled_duration: "15",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joinLink, setJoinLink] = useState<string | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetchUserProfile();
        setUserRole(res.user.role);
        setTeams(res.teams || []);
      } catch {
        // fallback ke localStorage jika gagal fetch
        const profile = localStorage.getItem("user_profile");
        if (profile) {
          const user = JSON.parse(profile);
          setUserRole(user.role);
          setTeams(user.teams || []);
        }
      }
    }
    getUser();
  }, []);

  // Refactor: fetchUpcoming diangkat ke parent scope
  async function fetchUpcoming() {
    setLoadingUpcoming(true);
    try {
      // Hitung offset timezone user dalam menit
      const tzOffset = -new Date().getTimezoneOffset();
      const res = await fetchWithAuth(`/api/sessions/today?tz_offset=${tzOffset}`);
      setUpcomingSessions(res.sessions || []);
    } catch {
      setUpcomingSessions([]);
    } finally {
      setLoadingUpcoming(false);
    }
  }

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setJoinLink(null);
    try {
      // Convert scheduled_start to ISO string with offset
      const scheduledStartISO = toLocalISOString(form.scheduled_start);
      const res = await fetchWithAuth("http://127.0.0.1:5000/api/sessions/create", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          scheduled_start: scheduledStartISO,
          scheduled_duration: Number(form.scheduled_duration),
        }),
      });
      setSuccess("Sesi berhasil dibuat!");
      setForm({ title: "", scheduled_start: "", scheduled_duration: "15" });
      if (res.session && res.session.id) {
        // Buat link undangan berbasis session_id
        const invitationLink = `${window.location.origin}/join/${res.session.id}`;
        setJoinLink(invitationLink);
      }
      // Setelah membuat sesi, refresh daftar upcoming scrums
      fetchUpcoming(); // panggil ulang agar sesi baru langsung muncul
    } catch (e: any) {
      setError(e.message || "Gagal membuat sesi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jadwal Scrum</h1>
        <p className="text-muted-foreground">
          Kelola dan jadwalkan sesi Daily Scrum Anda
        </p>
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
              <CardDescription>
                Semua sesi yang dijadwalkan hari ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingScrums sessions={upcomingSessions} />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            {/* Sesi Aktif Real-time */}
            <Card>
              <CardHeader>
                <CardTitle>Sesi Aktif</CardTitle>
                <CardDescription>
                  Sesi Scrum yang sedang berjalan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUpcoming ? (
                  <div>Memuat sesi...</div>
                ) : (
                  (() => {
                    const active = upcomingSessions.find(
                      (s: any) => s.status === "ACTIVE" || s.status === "IN_PROGRESS"
                    );
                    if (!active) {
                      return (
                        <div className="text-sm text-gray-500">
                          Tidak ada sesi aktif hari ini.
                        </div>
                      );
                    }
                    return (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-green-800">
                              {active.title}
                            </h3>
                            <p className="text-sm text-green-700">
                              Dimulai pada{" "}
                              {new Date(active.scheduled_start).toLocaleTimeString(
                                "id-ID",
                                { hour: "2-digit", minute: "2-digit" }
                              )}{" "}
                              • {active.scheduled_duration} menit
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs text-green-700">Live</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-green-700 mb-2">
                          <Users className="mr-1 h-4 w-4" />
                          {active.participants
                            ? active.participants.length
                            : "-"}{" "}
                          peserta
                        </div>
                        <div className="flex items-center text-sm text-green-700 mb-4">
                          <Clock className="mr-1 h-4 w-4" />
                          {/* Hitung waktu berjalan */}
                          {(() => {
                            const start = new Date(active.scheduled_start);
                            const now = new Date();
                            const elapsed = Math.floor(
                              (now.getTime() - start.getTime()) / 60000
                            );
                            return elapsed > 0
                              ? `${elapsed} menit berlalu`
                              : "Baru dimulai";
                          })()}
                        </div>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            if (active.join_token) {
                              router.push(`/join/${active.join_token}`);
                            }
                          }}
                        >
                          <Video className="mr-1 h-4 w-4" />
                          Gabung Sesi
                        </Button>
                      </div>
                    );
                  })()
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jadwal Minggu Ini</CardTitle>
                <CardDescription>
                  Ikhtisar semua sesi minggu ini
                </CardDescription>
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
          {userRole?.toLowerCase() === "facilitator" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Jadwalkan Sesi Baru</CardTitle>
                  <CardDescription>Buat sesi Daily Scrum baru</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="title">Judul Sesi</Label>
                      <Input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_start">Waktu Mulai</Label>
                      <Input
                        id="scheduled_start"
                        name="scheduled_start"
                        type="datetime-local"
                        value={form.scheduled_start}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_duration">Durasi (menit)</Label>
                      <Input
                        id="scheduled_duration"
                        name="scheduled_duration"
                        type="number"
                        min="5"
                        max="120"
                        value={form.scheduled_duration}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      disabled={loading}
                    >
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      {loading ? "Menyimpan..." : "Jadwalkan Sesi"}
                    </Button>
                    {success && (
                      <div className="text-green-600 mt-2">{success}</div>
                    )}
                    {error && <div className="text-red-600 mt-2">{error}</div>}
                  </form>
                  {joinLink && (
                    <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded">
                      <span className="font-medium">
                        Link undangan untuk anggota tim:
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={joinLink}
                          readOnly
                          className="w-full px-2 py-1 border rounded text-xs bg-gray-100"
                          onFocus={(e) => e.target.select()}
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(joinLink);
                            toast({
                              title: "Link berhasil disalin!",
                              description: "Undangan sesi telah disalin ke clipboard.",
                            });
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pilih Tanggal</CardTitle>
                  <CardDescription>
                    Pilih kapan untuk menjadwalkan sesi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              Hanya facilitator yang dapat membuat jadwal sesi baru.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
