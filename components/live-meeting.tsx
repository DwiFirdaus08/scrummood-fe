"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

interface Suggestion {
  id: string;
  content: string;
}

interface LiveMeetingProps {
  sessionId: number;
  userName: string;
}

export default function LiveMeeting({ sessionId, userName }: LiveMeetingProps) {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [emotions, setEmotions] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const socketRef = useRef<any>(null);

  // Socket.IO setup
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const socket = io("http://localhost:8088", {
      transports: ["websocket"],
      query: { token },
    });
    socketRef.current = socket;

    // Listen for chat messages
    socket.on("chat_message", (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    // Listen for emotion updates
    socket.on("emotion_update", (data: { user: string; emotion: string }) => {
      setEmotions((prev) => ({ ...prev, [data.user]: data.emotion }));
    });

    // Listen for new AI suggestions
    socket.on("new_suggestions", (data: Suggestion[]) => {
      setSuggestions(data);
    });

    // Optionally: join the session room
    socket.emit("join_session", { session_id: sessionId });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  // Submit chat message and emotion
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    // Send chat message via socket
    socketRef.current.emit("chat_message", {
      session_id: sessionId,
      user: userName,
      content: chatInput,
    });
    // Send emotion submission to backend
    await fetchWithAuth("http://127.0.0.1:5000/api/emotions/submit", {
      method: "POST",
      body: JSON.stringify({
        session_id: sessionId,
        source: "text",
        content: chatInput,
      }),
    });
    setChatInput("");
  };

  // Trigger AI suggestions every 30s or via button
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWithAuth("http://127.0.0.1:5000/api/suggestions/generate", {
        method: "POST",
        body: JSON.stringify({ session_id: sessionId }),
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleManualSuggestion = async () => {
    await fetchWithAuth("http://127.0.0.1:5000/api/suggestions/generate", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Chat & Emotion */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Live Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 h-64 overflow-y-auto bg-gray-50 rounded p-2">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="mb-2">
                <span className="font-semibold">{msg.user}:</span> {msg.content}
                <span className="ml-2 text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          <form className="flex gap-2" onSubmit={handleChatSubmit}>
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ketik pesan..."
            />
            <Button type="submit">Kirim</Button>
          </form>
        </CardContent>
      </Card>
      {/* Live Emotions & Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Live Emotions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {Object.entries(emotions).length === 0 && (
              <div>Belum ada data emosi.</div>
            )}
            {Object.entries(emotions).map(([user, emotion]) => (
              <div key={user} className="mb-1">
                <span className="font-semibold">{user}:</span>{" "}
                <span>{emotion}</span>
              </div>
            ))}
          </div>
          <div className="mb-2 flex justify-between items-center">
            <span className="font-bold">AI Suggestions</span>
            <Button size="sm" onClick={handleManualSuggestion}>
              Generate Now
            </Button>
          </div>
          <div className="space-y-2">
            {suggestions.length === 0 && <div>Belum ada saran AI.</div>}
            {suggestions.map((s) => (
              <div key={s.id} className="p-2 bg-teal-50 rounded text-sm">
                {s.content}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
