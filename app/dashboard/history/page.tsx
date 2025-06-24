import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SessionHistory } from "@/components/session-history"
import { Calendar, Download, Filter } from "lucide-react"

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Riwayat Sesi</h1>
        <p className="text-muted-foreground">Tinjau sesi Scrum sebelumnya dan data emosi</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Minggu Ini
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Ekspor Data
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">Semua Sesi</TabsTrigger>
          <TabsTrigger value="frontend">Tim Frontend</TabsTrigger>
          <TabsTrigger value="backend">Tim Backend</TabsTrigger>
          <TabsTrigger value="design">Tim Desain</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Semua Sesi</CardTitle>
              <CardDescription>Riwayat lengkap semua sesi tim</CardDescription>
            </CardHeader>
            <CardContent>
              <SessionHistory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frontend">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Sesi Tim Frontend</CardTitle>
              <CardDescription>Riwayat sesi Tim Frontend</CardDescription>
            </CardHeader>
            <CardContent>
              <SessionHistory team="frontend" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backend">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Sesi Tim Backend</CardTitle>
              <CardDescription>Riwayat sesi Tim Backend</CardDescription>
            </CardHeader>
            <CardContent>
              <SessionHistory team="backend" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Sesi Tim Desain</CardTitle>
              <CardDescription>Riwayat sesi Tim Desain</CardDescription>
            </CardHeader>
            <CardContent>
              <SessionHistory team="design" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
