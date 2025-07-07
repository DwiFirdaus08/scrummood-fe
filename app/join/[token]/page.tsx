"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React from "react";

export default function JoinSessionPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  // Next.js 14+ param unwrap (future proof)
  // @ts-ignore
  const usableParams: any =
    typeof params === "object" && params !== null && "then" in params
      ? React.use(params)
      : params;
  const joinToken = usableParams.token;

  useEffect(() => {
    async function fetchSession() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithAuth(
          `https://scrummood-be-production.up.railway.app/api/sessions/join/${joinToken}`
        );
        setSession(res.session);
      } catch (e: any) {
        setError(
          e.message ||
            "Gagal mengambil data sesi atau Anda tidak berhak mengakses sesi ini."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [joinToken]);

  if (loading) return <div>Memuat data sesi...</div>;
  if (error)
    return (
      <Card className="max-w-lg mx-auto mt-10">
        <CardHeader>
          <CardTitle>Gagal Join Sesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  if (!session) return null;

  const joinLink = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle>Detail Sesi Scrum</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 font-bold">{session.title}</div>
        <div>
          Waktu Mulai: {new Date(session.scheduled_start).toLocaleString()}
        </div>
        <div>Durasi: {session.scheduled_duration} menit</div>
        <div className="mt-4">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
            onClick={() => router.push("/dashboard/meeting")}
          >
            Masuk ke Meeting
          </Button>
        </div>
        <div className="mt-4">
          <span className="font-medium">Link undangan untuk anggota tim:</span>
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
      </CardContent>
    </Card>
  );
}
