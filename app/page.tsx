import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Brain, MessageSquare, Calendar, Shield, Zap, Heart } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-teal-700">ScrumMood</h1>
          </div>
          <div className="flex space-x-3">
            <Link href="/login">
              <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-teal-600 hover:bg-teal-700">Daftar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-teal-200 text-teal-700">
            Kolaborasi Cerdas & Manajemen Mood Tim Secara Real-time
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ubah
            <span className="text-teal-600"> Daily Scrum</span> Anda
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Pantau, analisis, dan kelola dinamika emosi anggota tim selama sesi Daily Scrum dengan wawasan AI dan pelacakan emosi secara real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-3">
                Coba Gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50 text-lg px-8 py-3">
                Sudah Punya Akun?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan untuk Dinamika Tim yang Lebih Baik</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Segala yang Anda butuhkan untuk memahami dan meningkatkan kesejahteraan emosional tim Anda selama sesi Scrum.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-teal-100 hover:border-teal-200 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>Pelacakan Emosi Real-time</CardTitle>
                <CardDescription>
                  Pantau emosi tim melalui analisis teks, suara, dan wajah selama sesi langsung.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-teal-100 hover:border-teal-200 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Visualisasi Tim</CardTitle>
                <CardDescription>
                  Visualisasikan pola emosional dengan peta panas, garis waktu, dan analisis komparatif.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-teal-100 hover:border-teal-200 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Wawasan Berbasis AI</CardTitle>
                <CardDescription>
                  Dapatkan saran cerdas untuk meningkatkan dinamika tim dan mengurangi tingkat stres.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-teal-100 hover:border-teal-200 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Integrasi Rapat Langsung</CardTitle>
                <CardDescription>Integrasikan dengan mulus ke alat dan alur kerja rapat yang sudah ada.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-teal-100 hover:border-teal-200 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Manajemen Sesi</CardTitle>
                <CardDescription>
                  Jadwalkan, lacak, dan analisis semua sesi Daily Scrum Anda di satu tempat.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-teal-100 hover:border-teal-200 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Privasi & Keamanan</CardTitle>
                <CardDescription>
                  Keamanan tingkat perusahaan dengan kontrol penuh atas data emosional tim Anda.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Mengapa Tim Memilih ScrumMood</h2>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan tim yang telah meningkatkan kolaborasi dan produktivitas mereka.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-teal-100">Peningkatan komunikasi tim</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">60%</div>
              <div className="text-teal-100">Pengurangan tingkat stres rapat</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">40%</div>
              <div className="text-teal-100">Penyelesaian masalah lebih cepat</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Siap Mengubah Dinamika Tim Anda?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Mulailah percobaan gratis Anda hari ini dan lihat bagaimana ScrumMood dapat membantu tim Anda berkomunikasi lebih baik dan bekerja lebih efektif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-3">
                Coba Gratis
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-50 text-lg px-8 py-3"
              >
                Hubungi Penjualan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">ScrumMood</h3>
              </div>
              <p className="text-gray-400">
                Smart Collaborative Real-time Understanding & Management of Mood during Daily Scrum sessions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white">
                    Fitur
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Harga
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-white">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-white">
                    Integrasi
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Karir
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Hubungi
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Pusat Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white">
                    Dokumentasi
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Syarat dan Ketentuan
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ScrumMood. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
