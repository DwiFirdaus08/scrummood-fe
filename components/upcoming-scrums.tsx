"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import io from "socket.io-client";
import { useRouter } from "next/navigation";

type ScrumSession = {
  id: number;
  title: string;
  team_id: number;
  facilitator_id: number;
  scheduled_start: string;
  scheduled_duration: number;
  status: string;
};

export function UpcomingScrums() {
  const [sessions, setSessions] = useState<ScrumSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchWithAuth("http://127.0.0.1:5000/api/sessions/today")
      .then((res) => setSessions(res.sessions))
      .catch((e) => setError("Gagal memuat sesi"))
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = (session: ScrumSession) => {
    // Redirect ke halaman join dengan join_token
    if ((session as any).join_token) {
      router.push(`/join/${(session as any).join_token}`);
    } else {
      alert("Link join tidak tersedia untuk sesi ini.");
    }
  };

  if (loading) return <div>Memuat sesi...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!sessions.length) return <div>Tidak ada sesi scrum hari ini.</div>;

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="flex justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="space-y-1">
            <p className="font-medium">{session.title}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-1 h-4 w-4" />
              {new Date(session.scheduled_start).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="mr-1 h-4 w-4" />
              Facilitator: {session.facilitator_id}
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Button
              size="sm"
              className="h-8 bg-teal-600 hover:bg-teal-700"
              onClick={() => handleJoin(session)}
            >
              <Video className="mr-1 h-4 w-4" />
              Gabung
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
