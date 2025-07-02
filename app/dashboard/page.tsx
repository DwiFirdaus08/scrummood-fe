"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmotionChart } from "@/components/emotion-chart";
import { TeamMoodSummary } from "@/components/team-mood-summary";
import { RecentSuggestions } from "@/components/recent-suggestions";
import { UpcomingScrums } from "@/components/upcoming-scrums";
import {
  Clock,
  Video,
  TrendingUp,
  Users,
  Calendar,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import io from "socket.io-client";
import { fetchWithAuth } from "@/lib/api";

// Dummy endMeeting function (replace with real implementation or import as needed)
async function endMeeting() {
  // Example: await fetch("/api/end_meeting", { method: "POST", credentials: "include" });
  return Promise.resolve();
}

export default function Dashboard() {
  const [history, setHistory] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<any>(null);

  // State for real-time emotion trend (for chart)
  const [realtimeEmotionTrend, setRealtimeEmotionTrend] = useState<any[]>([]);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [historyRes, upcomingRes] = await Promise.all([
        fetchWithAuth("/api/sessions/session_history"),
        fetchWithAuth("/api/sessions/today"),
      ]);
      setHistory(historyRes.sessions || []);
      setUpcoming(upcomingRes.sessions || []);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(s);
    // Listen for session/AI updates
    s.on("session_ended", fetchDashboardData);
    s.on("ai_suggestions_update", fetchDashboardData);
    s.on("ai_insights_update", fetchDashboardData);
    return () => {
      s.disconnect();
    };
  }, [fetchDashboardData]);

  // Listen for real-time emotion updates (from meeting page via Socket.IO)
  useEffect(() => {
    if (!socket) return;
    // Handler for emotion_update event
    const handleEmotionUpdate = (payload: any) => {
      // payload: { session_id, user_id, emotions: {happy, sad, ...} }
      if (!payload || !payload.emotions) return;
      // Use timestamp for x-axis, or fallback to Date.now()
      const timestamp = Date.now();
      setRealtimeEmotionTrend((prev) =>
        [...prev, { timestamp, ...payload.emotions }].slice(-50)
      ); // Keep last 50 points for performance
    };
    socket.on("emotion_update", handleEmotionUpdate);
    return () => {
      socket.off("emotion_update", handleEmotionUpdate);
    };
  }, [socket]);

  if (loading) return <div className="p-6">Memuat data dashboard...</div>;

  // Sesi aktif: ambil sesi yang statusnya aktif (belum selesai)
  const activeSession = upcoming.find(
    (s) => s.status === "ACTIVE" || s.status === "IN_PROGRESS"
  );
  // Mood tim: dari sesi terakhir yang selesai
  const lastSession = history[0];
  const teamMood = lastSession?.emotion_summary;
  // Saran terbaru: dari sesi terakhir
  const aiSuggestions = lastSession?.ai_suggestions || [];
  // Tren emosi: agregasi 7 sesi terakhir
  const emotionTrend = history.slice(0, 7).map((s) => ({
    date: s.scheduled_start,
    ...s.emotion_summary,
  }));
  // Sesi mendatang: upcoming yang belum mulai
  const nextSessions = upcoming.filter((s) => s.status !== "COMPLETED");
  // Combine backend history trend and real-time trend for chart
  const combinedEmotionTrend = [
    ...emotionTrend,
    ...realtimeEmotionTrend.map((e) => ({
      date: new Date(e.timestamp).toISOString(),
      ...e,
    })),
  ];

  // If no data, show a message in the chart area
  const hasEmotionData =
    combinedEmotionTrend &&
    combinedEmotionTrend.length > 0 &&
    Object.keys(
      combinedEmotionTrend[combinedEmotionTrend.length - 1] || {}
    ).some(
      (k) =>
        [
          "happy",
          "sad",
          "angry",
          "fearful",
          "disgusted",
          "surprised",
          "neutral",
        ].includes(k) &&
        combinedEmotionTrend[combinedEmotionTrend.length - 1][k] > 0
    );

  // --- FIX: Always show chart, fallback to real-time only if no backend data ---
  const chartData = hasEmotionData
    ? combinedEmotionTrend
    : realtimeEmotionTrend.map((e) => ({
        date: new Date(e.timestamp).toISOString(),
        ...e,
      }));

  // After ending meeting, redirect to dashboard
  const endMeetingAndRedirect = async () => {
    await endMeeting();
    window.location.href = "/dashboard";
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Dasbor</h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang kembali! Pantau kesehatan emosional tim Anda dan sesi
            yang akan datang.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/dashboard/meeting">
            <Button className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
              <Video className="mr-2 h-4 w-4" /> Gabung Meeting Aktif
            </Button>
          </Link>
          <Link href="/dashboard/history">
            <Button variant="outline" className="w-full sm:w-auto">
              <Clock className="mr-2 h-4 w-4" /> Lihat Sesi Sebelumnya
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesi Aktif</CardTitle>
            <div
              className={`h-4 w-4 rounded-full ${
                activeSession ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSession ? 1 : 0}</div>
            <p className="text-xs text-muted-foreground">
              {activeSession ? activeSession.title : "Tidak ada sesi aktif"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Tim</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMood
                ? Object.entries(teamMood).sort(
                    ([, a], [, b]) => (b as number) - (a as number)
                  )[0][0]
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {teamMood
                ? `Dominan: ${
                    Object.entries(teamMood).sort(
                      ([, a], [, b]) => (b as number) - (a as number)
                    )[0][0]
                  }`
                : "Belum ada data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Scrum Mendatang
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nextSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              {nextSessions[0]
                ? `Berikutnya: ${nextSessions[0].title} (${new Date(
                    nextSessions[0].scheduled_start
                  ).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })})`
                : "Tidak ada scrum mendatang"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saran</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiSuggestions.length}</div>
            <p className="text-xs text-muted-foreground">
              {aiSuggestions.length
                ? `${aiSuggestions.length} saran dari AI`
                : "Belum ada saran"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tren Emosi Tim</CardTitle>
            <CardDescription>
              Pola emosional selama 7 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <EmotionChart data={chartData} />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Belum ada data tren emosi.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Tim Saat Ini</CardTitle>
            <CardDescription>Keadaan emosional waktu nyata</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamMoodSummary
              data={lastSession?.team_members || []}
              summary={teamMood}
            />
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
            <RecentSuggestions suggestions={aiSuggestions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sesi Mendatang
            </CardTitle>
            <CardDescription>
              Scrum Harian Anda yang dijadwalkan
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            <UpcomingScrums sessions={nextSessions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Wawasan Pribadi
            </CardTitle>
            <CardDescription>
              Rekomendasi yang dipersonalisasi untuk Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {/* TODO: Ambil dan render wawasan personal dari backend jika ada */}
            <div className="text-xs text-muted-foreground">
              Belum ada wawasan personal.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
