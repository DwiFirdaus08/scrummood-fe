"use client";

import { Button } from "@/components/ui/button";
import { Clock, Users, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import io from "socket.io-client";
import { useRouter } from "next/navigation";

type ScrumSession = {
  id: number | string;
  title: string;
  team_id?: number;
  facilitator_id?: number;
  scheduled_start: string;
  scheduled_duration?: number;
  status?: string;
  join_token?: string;
};

type UpcomingScrumsProps = {
  sessions: ScrumSession[];
};

export function UpcomingScrums({ sessions }: UpcomingScrumsProps) {
  const router = useRouter();
  const handleJoin = (session: ScrumSession) => {
    if (session.join_token) {
      router.push(`/join/${session.join_token}`);
    } else {
      alert("Link join tidak tersedia untuk sesi ini.");
    }
  };
  if (!sessions || sessions.length === 0)
    return <div>Tidak ada sesi scrum hari ini.</div>;
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
