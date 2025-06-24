"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleRegister}>
        <CardHeader>
          <CardTitle>Buat Akun</CardTitle>
          <CardDescription>Masukkan informasi Anda untuk membuat akun baru</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" placeholder="Budi Santoso" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="nama@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
            <Input id="confirm-password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <select
              id="role"
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
