"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SessionItem {
  id: number;
  title: string;
  scheduled_start: string;
  scheduled_duration: number;
}

interface EmotionSummary {
  dominant_emotion: string;
  emotion_distribution: Record<string, number>; // e.g. { happy: 60, sad: 20, ... }
  average_intensity: number;
}

export default function SessionHistoryList() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(null);
  const [summary, setSummary] = useState<EmotionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchWithAuth("http://127.0.0.1:5000/api/sessions/history")
      .then((res) => setSessions(res.sessions))
      .catch(() => setError("Gagal memuat riwayat sesi"))
      .finally(() => setLoading(false));
  }, []);

  const handleSessionClick = async (session: SessionItem) => {
    setSelectedSession(session);
    setSummary(null);
    setSummaryLoading(true);
    try {
      const res = await fetchWithAuth(
        `http://127.0.0.1:5000/api/emotions/session/${session.id}/summary`
      );
      setSummary(res);
    } catch {
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Sesi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Memuat sesi...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <ul className="divide-y">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className={`py-2 cursor-pointer hover:bg-gray-100 rounded ${selectedSession?.id === s.id ? "bg-teal-50" : ""}`}
                  onClick={() => handleSessionClick(s)}
                >
                  <div className="font-medium">{s.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(s.scheduled_start).toLocaleString()} • {s.scheduled_duration} menit
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Emosi Sesi</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryLoading && <div>Memuat ringkasan emosi...</div>}
          {!summaryLoading && selectedSession && !summary && (
            <div className="text-gray-500">Tidak ada data ringkasan emosi.</div>
          )}
          {!summaryLoading && summary && (
            <div>
              <div className="mb-2">
                <span className="font-semibold">Dominan:</span> {summary.dominant_emotion}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Distribusi Emosi:</span>
                <ul className="ml-4 list-disc">
                  {Object.entries(summary.emotion_distribution).map(([emo, pct]) => (
                    <li key={emo}>
                      {emo}: {pct}%
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Rata-rata Intensitas:</span> {summary.average_intensity}
              </div>
            </div>
          )}
          {!selectedSession && <div className="text-gray-400">Klik sesi untuk melihat ringkasan emosi.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
