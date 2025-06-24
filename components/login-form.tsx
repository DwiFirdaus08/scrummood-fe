"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <Card className="w-full">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Masuk</TabsTrigger>
          <TabsTrigger value="register">Daftar</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Masuk</CardTitle>
              <CardDescription>Masukkan kredensial Anda untuk mengakses akun</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nama@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
                {isLoading ? "Sedang masuk..." : "Masuk"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        <TabsContent value="register">
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
              <Label htmlFor="register-email">Email</Label>
              <Input id="register-email" type="email" placeholder="nama@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Kata Sandi</Label>
              <Input id="register-password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Peran</Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="member">Anggota Tim</option>
                <option value="facilitator">Fasilitator</option>
              </select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-teal-600 hover:bg-teal-700">Buat Akun</Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
