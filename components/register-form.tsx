"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchWithAuth } from "@/lib/api"

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const form = e.currentTarget
    const full_name = (form.elements.namedItem("name") as HTMLInputElement)?.value
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value
    const confirmPassword = (form.elements.namedItem("confirm-password") as HTMLInputElement)?.value
    const role = (form.elements.namedItem("role") as HTMLSelectElement)?.value
    if (!full_name || !email || !password || !confirmPassword) {
      setError("Semua field wajib diisi")
      setIsLoading(false)
      return
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok")
      setIsLoading(false)
      return
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username: email.split("@")[0],
          password,
          full_name,
          role,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error || "Registrasi gagal")
        setIsLoading(false)
        return
      }
      const data = await res.json()
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)
      setIsLoading(false)
      router.push("/dashboard")
    } catch (e: any) {
      setError(e.message || "Registrasi gagal")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleRegister}>
        <CardHeader>
          <CardTitle>Buat Akun</CardTitle>
          <CardDescription>Masukkan informasi Anda untuk membuat akun baru</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" placeholder="Budi Santoso" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="nama@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
            <Input id="confirm-password" name="confirm-password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <select
              id="role"
              name="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="member">Anggota Tim</option>
              <option value="facilitator">Fasilitator</option>
              <option value="manager">Manajer</option>
            </select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
            {isLoading ? "Membuat akun..." : "Buat Akun"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
