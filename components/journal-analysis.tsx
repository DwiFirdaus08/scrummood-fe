"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function JournalAnalysis() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="trends">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Tren Emosi</TabsTrigger>
          <TabsTrigger value="insights">Wawasan Pribadi</TabsTrigger>
          <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-4">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Tren Emosi Bulanan</h3>
              <div className="h-60 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Grafik tren emosi akan muncul di sini</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Emosi Paling Sering Muncul</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Bahagia</span>
                      </div>
                      <span className="text-sm">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm">Netral</span>
                      </div>
                      <span className="text-sm">30%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">Stres</span>
                      </div>
                      <span className="text-sm">15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Pemicu Emosi</h3>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                      Deadline (stres)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      Masalah teknis (frustrasi)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      Kolaborasi tim (bahagia)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                      Kebutuhan tidak jelas (bingung)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-4">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Pola Emosi</h3>
              <p className="text-sm">
                Entri jurnal Anda menunjukkan Anda cenderung merasa paling positif di awal minggu, dengan tingkat stres
                yang meningkat seiring berjalannya minggu. Keadaan emosi Anda sangat dipengaruhi oleh deadline proyek dan dinamika tim.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Gaya Komunikasi</h3>
              <p className="text-sm">
                Refleksi Anda menunjukkan Anda berkomunikasi paling efektif saat merasa didengar dan dihargai. Anda cenderung lebih pendiam saat stres, yang bisa memengaruhi partisipasi di sesi Scrum.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Respons Terhadap Stres</h3>
              <p className="text-sm">
                Saat tertekan, entri jurnal Anda menunjukkan Anda lebih fokus pada detail teknis dan pemecahan masalah. Ini bisa menjadi kekuatan, namun kadang membuat Anda kurang memperhatikan aspek emosional kolaborasi tim.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-4">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Manajemen Stres</h3>
              <p className="text-sm text-green-700 mb-2">
                Berdasarkan pola jurnal Anda, pertimbangkan teknik berikut:
              </p>
              <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                <li>Ambil jeda singkat sebelum meeting penting</li>
                <li>Latihan pernapasan 2 menit saat merasa kewalahan</li>
                <li>Jadwalkan waktu jeda antar meeting untuk memproses emosi</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Peningkatan Komunikasi</h3>
              <p className="text-sm text-blue-700 mb-2">Untuk meningkatkan komunikasi saat Scrum:</p>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Siapkan poin penting sebelum meeting untuk mengurangi kecemasan</li>
                <li>Gunakan pernyataan "Saya" saat menyampaikan kekhawatiran</li>
                <li>Ajukan pertanyaan klarifikasi saat merasa ragu</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">Dinamika Tim</h3>
              <p className="text-sm text-purple-700 mb-2">Untuk berkontribusi pada lingkungan tim yang positif:</p>
              <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                <li>Apresiasi kontribusi anggota tim</li>
                <li>Bagikan keadaan emosi Anda jika perlu</li>
                <li>Sarankan aktivitas team building singkat saat suasana tegang</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
