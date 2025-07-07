"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamEmotionMap } from "@/components/team-emotion-map";
import { TeamTimeline } from "@/components/team-timeline";
import { TeamComparison } from "@/components/team-comparison";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function TeamVisualizationPage() {
  const [realtimeEmotionTrend, setRealtimeEmotionTrend] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(s);
    const handleEmotionUpdate = (payload: any) => {
      if (!payload || !payload.emotions) return;
      const timestamp = Date.now();
      setRealtimeEmotionTrend((prev) =>
        [...prev, { timestamp, ...payload.emotions }].slice(-50)
      );
    };
    s.on("emotion_update", handleEmotionUpdate);
    return () => {
      s.off("emotion_update", handleEmotionUpdate);
      s.disconnect();
    };
  }, []);

  // --- DUMMY DATA FALLBACK FOR TIMELINE ---
  const dummyTimelineData = [
    {
      date: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      happy: 0.4,
      neutral: 0.3,
      stressed: 0.1,
      sad: 0.1,
      angry: 0.1,
    },
    {
      date: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
      happy: 0.5,
      neutral: 0.2,
      stressed: 0.1,
      sad: 0.1,
      angry: 0.1,
    },
    {
      date: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      happy: 0.3,
      neutral: 0.4,
      stressed: 0.15,
      sad: 0.1,
      angry: 0.05,
    },
    {
      date: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
      happy: 0.6,
      neutral: 0.2,
      stressed: 0.05,
      sad: 0.05,
      angry: 0.1,
    },
    {
      date: new Date().toISOString(),
      happy: 0.7,
      neutral: 0.1,
      stressed: 0.05,
      sad: 0.05,
      angry: 0.1,
    },
  ];

  // Format data for TeamTimeline (timelineData)
  const timelineData =
    realtimeEmotionTrend.length > 0
      ? realtimeEmotionTrend.map((e) => ({
          date: new Date(e.timestamp).toISOString(),
          happy: e.happy ?? 0,
          neutral: e.neutral ?? 0,
          stressed:
            typeof e.stressed === "number"
              ? e.stressed
              : ((e.fearful ?? 0) + (e.disgusted ?? 0)) / 2,
          sad: e.sad ?? 0,
          angry: e.angry ?? 0,
        }))
      : dummyTimelineData;

  console.log("timelineData", timelineData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visualisasi Tim</h1>
        <p className="text-muted-foreground">
          Visualisasikan dan pahami pola emosional tim Anda
        </p>
      </div>

      <Tabs defaultValue="heatmap">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="heatmap">Peta Emosi</TabsTrigger>
          <TabsTrigger value="timeline">Garis Waktu</TabsTrigger>
          <TabsTrigger value="comparison">Perbandingan Tim</TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Peta Emosi Tim</CardTitle>
              <CardDescription>
                Visualisasikan keadaan emosi tim Anda pada sesi ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamEmotionMap />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Garis Waktu Emosi</CardTitle>
              <CardDescription>
                Lacak perubahan emosi secara real-time hari ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamTimeline data={timelineData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Tim</CardTitle>
              <CardDescription>
                Bandingkan pola emosi antar tim atau sesi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamComparison />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Wawasan Emosional</CardTitle>
            <CardDescription>
              Wawasan yang dihasilkan AI berdasarkan emosi tim
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Tren Positif</h3>
                <p className="text-sm text-gray-700">
                  Suasana hati tim secara keseluruhan telah meningkat sebesar
                  15% dibandingkan dengan sesi minggu lalu. Tren positif ini
                  sejalan dengan selesainya tonggak proyek baru-baru ini.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Pola Stres</h3>
                <p className="text-sm text-gray-700">
                  Tingkat stres cenderung memuncak sekitar 15 menit setelah sesi
                  dimulai. Pertimbangkan untuk merestrukturisasi rapat untuk
                  membahas topik yang menantang lebih awal.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Dinamika Tim</h3>
                <p className="text-sm text-gray-700">
                  Ada keselarasan emosional yang nyata antar anggota tim,
                  menunjukkan kohesi tim yang baik dan pemahaman bersama tentang
                  tujuan proyek.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Emosi</CardTitle>
            <CardDescription>Rincian emosi di seluruh tim</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Senang</span>
                </div>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
                <span className="text-sm">40%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Netral</span>
                </div>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
                <span className="text-sm">30%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span>Stres</span>
                </div>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: "15%" }}
                  ></div>
                </div>
                <span className="text-sm">15%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                  <span>Sedih</span>
                </div>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gray-500 h-2.5 rounded-full"
                    style={{ width: "10%" }}
                  ></div>
                </div>
                <span className="text-sm">10%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Marah</span>
                </div>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{ width: "5%" }}
                  ></div>
                </div>
                <span className="text-sm">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
