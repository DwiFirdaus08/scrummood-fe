import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamEmotionMap } from "@/components/team-emotion-map"
import { TeamTimeline } from "@/components/team-timeline"
import { TeamComparison } from "@/components/team-comparison"

export default function TeamVisualizationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visualisasi Tim</h1>
        <p className="text-muted-foreground">Visualisasikan dan pahami pola emosional tim Anda</p>
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
              <CardDescription>Visualisasikan keadaan emosi tim Anda pada sesi ini</CardDescription>
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
              <CardDescription>Lacak perubahan emosi selama sesi berlangsung</CardDescription>
            </CardHeader>
            <CardContent>
              <TeamTimeline />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Tim</CardTitle>
              <CardDescription>Bandingkan pola emosi antar tim atau sesi</CardDescription>
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
            <CardDescription>Wawasan yang dihasilkan AI berdasarkan emosi tim</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Tren Positif</h3>
                <p className="text-sm text-gray-700">
                  Suasana hati tim secara keseluruhan telah meningkat sebesar 15% dibandingkan dengan sesi minggu lalu.
                  Tren positif ini sejalan dengan selesainya tonggak proyek baru-baru ini.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Pola Stres</h3>
                <p className="text-sm text-gray-700">
                  Tingkat stres cenderung memuncak sekitar 15 menit setelah sesi dimulai. Pertimbangkan untuk
                  merestrukturisasi rapat untuk membahas topik yang menantang lebih awal.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Dinamika Tim</h3>
                <p className="text-sm text-gray-700">
                  Ada keselarasan emosional yang nyata antar anggota tim, menunjukkan kohesi tim yang baik dan
                  pemahaman bersama tentang tujuan proyek.
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
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "40%" }}></div>
                </div>
                <span className="text-sm">40%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Netral</span>
                </div>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "30%" }}></div>
                </div>
                <span className="text-sm">30%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span>Stres</span>
                </div>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                </div>
                <span className="text-sm">15%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                  <span>Sedih</span>
                </div>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: "10%" }}></div>
                </div>
                <span className="text-sm">10%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Marah</span>
                </div>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "5%" }}></div>
                </div>
                <span className="text-sm">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
