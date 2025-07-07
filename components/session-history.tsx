"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, BarChart, Eye } from "lucide-react";
import { useEffect, useState } from "react";

export type SessionSummary = {
  id: number;
  title: string;
  team_id: number | null;
  facilitator_id: number;
  scheduled_start: string;
  scheduled_duration: number;
  status: string;
  created_at: string;
  join_token: string;
  actual_start?: string;
  actual_end?: string;
  agenda?: any[];
  emotion_summary?: Record<string, number>;
  ai_suggestions?: any[];
};

type SessionHistoryProps = {
  team?: string;
};

export function SessionHistory({ team }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(
    null
  );

  useEffect(() => {
    setLoading(true);
    fetch("/api/sessions/session_history", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.sessions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleViewSummary = (session: SessionSummary) => {
    fetch(`/api/sessions/session_summary/${session.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setSelectedSession(data));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">
                {new Date(session.scheduled_start).toLocaleString()}
              </span>
              <Users className="h-4 w-4 text-gray-500 ml-4" />
              <span className="text-sm">
                Facilitator: {session.facilitator_id}
              </span>
            </div>
            <div className="font-bold text-lg">{session.title}</div>
            <div className="flex gap-2 mt-1">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                Status: {session.status}
              </span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                Durasi: {session.scheduled_duration} menit
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-[180px]">
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-blue-500" />
              {session.emotion_summary &&
                Object.entries(session.emotion_summary).map(([emo, val]) => (
                  <span key={emo} className="text-xs capitalize">
                    {emo}: {Math.round(val * 100)}%
                  </span>
                ))}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewSummary(session)}
            >
              <Eye className="h-4 w-4 mr-1" /> Lihat Summary
            </Button>
          </div>
        </div>
      ))}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
            <h2 className="text-xl font-bold mb-2">
              Summary Sesi: {selectedSession.title}
            </h2>
            <div className="mb-2">
              <strong>Emosi Tim:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedSession.emotion_summary &&
                  Object.entries(selectedSession.emotion_summary).map(
                    ([emo, val]) => (
                      <span
                        key={emo}
                        className="text-xs bg-gray-100 px-2 py-1 rounded capitalize"
                      >
                        {emo}: {Math.round(val * 100)}%
                      </span>
                    )
                  )}
              </div>
            </div>
            <div className="mb-2">
              <strong>AI Saran:</strong>
              <ul className="list-disc ml-6">
                {selectedSession.ai_suggestions &&
                selectedSession.ai_suggestions.length > 0 ? (
                  selectedSession.ai_suggestions.map((s: any, idx: number) => (
                    <li key={idx} className="text-xs mb-1">
                      {s.title}: {s.description}
                    </li>
                  ))
                ) : (
                  <li className="text-xs">Tidak ada saran AI.</li>
                )}
              </ul>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedSession(null)}
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
