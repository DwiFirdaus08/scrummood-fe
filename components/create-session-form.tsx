"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CreateSessionFormProps {
  teamIdOptions: { id: number; name: string }[];
  onSessionCreated?: () => void;
}

export function CreateSessionForm({
  teamIdOptions,
  onSessionCreated,
}: CreateSessionFormProps) {
  const [title, setTitle] = useState("");
  const [teamId, setTeamId] = useState("");
  const [scheduledStart, setScheduledStart] = useState("");
  const [scheduledDuration, setScheduledDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await fetchWithAuth(
        "https://scrummood-be-production.up.railway.app/api/sessions/create",
        {
          method: "POST",
          body: JSON.stringify({
            title,
            team_id: Number(teamId),
            scheduled_start: scheduledStart,
            scheduled_duration: Number(scheduledDuration),
          }),
        }
      );
      setSuccess(true);
      setTitle("");
      setTeamId("");
      setScheduledStart("");
      setScheduledDuration("");
      if (onSessionCreated) onSessionCreated();
    } catch (err: any) {
      setError(err.message || "Gagal membuat sesi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-lg font-semibold mb-2">Buat Sesi Scrum Baru</h2>
      <div>
        <Label htmlFor="title">Judul Sesi</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="team">Tim</Label>
        <select
          id="team"
          className="w-full border rounded px-3 py-2"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          required
        >
          <option value="">Pilih Tim</option>
          {teamIdOptions.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="scheduledStart">Waktu Mulai</Label>
        <Input
          id="scheduledStart"
          type="datetime-local"
          value={scheduledStart}
          onChange={(e) => setScheduledStart(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="scheduledDuration">Durasi (menit)</Label>
        <Input
          id="scheduledDuration"
          type="number"
          min={1}
          value={scheduledDuration}
          onChange={(e) => setScheduledDuration(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm">Sesi berhasil dibuat!</div>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Membuat..." : "Buat Sesi"}
      </Button>
    </form>
  );
}
