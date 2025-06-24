import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { Heart } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-teal-700">ScrumMood</h1>
          </Link>
          <p className="text-gray-600 mt-2">Selamat datang kembali! Masuk ke akun Anda untuk melanjutkan.</p>
        </div>
        <LoginForm />
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link href="/register" className="text-teal-600 hover:text-teal-700 font-medium">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
