"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Calendar, MessageSquare, Book, Settings, Home, Clock, Video, Brain } from "lucide-react"

const navItems = [
	{
		name: "Beranda",
		href: "/dashboard",
		icon: Home,
	},
	{
		name: "Visualisasi Tim",
		href: "/dashboard/team-visualization",
		icon: BarChart3,
	},
	{
		name: "Jadwal Scrum",
		href: "/dashboard/scrum-schedule",
		icon: Calendar,
	},
	{
		name: "Jurnal Harian",
		href: "/dashboard/journal",
		icon: Book,
	},
	{
		name: "Obrolan Tim",
		href: "/dashboard/chat",
		icon: MessageSquare,
	},
	{
		name: "Rapat Langsung",
		href: "/dashboard/meeting",
		icon: Video,
	},
	{
		name: "Insight Pribadi",
		href: "/dashboard/personal-insights",
		icon: Brain,
	},
	{
		name: "Riwayat Sesi",
		href: "/dashboard/history",
		icon: Clock,
	},
	{
		name: "Pengaturan",
		href: "/dashboard/settings",
		icon: Settings,
	},
]

export function Sidebar() {
	const pathname = usePathname()

	return (
		<aside className="hidden md:flex md:w-64 md:flex-col">
			<div className="flex flex-col flex-1 min-h-0 bg-teal-800">
				<div className="flex items-center h-16 flex-shrink-0 px-4 bg-teal-900">
					<h1 className="text-xl font-bold text-white">ScrumMood</h1>
				</div>
				<div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
					<nav className="mt-5 flex-1 px-2 space-y-1">
						{navItems.map((item) => {
							const isActive = pathname === item.href
							return (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										"group flex items-center px-2 py-2 text-sm font-medium rounded-md",
										isActive ? "bg-teal-900 text-white" : "text-teal-100 hover:bg-teal-700",
									)}
								>
									<item.icon className={cn("mr-3 flex-shrink-0 h-6 w-6", isActive ? "text-white" : "text-teal-200")} />
									{item.name}
								</Link>
							)
						})}
					</nav>
				</div>
				<div className="flex-shrink-0 flex border-t border-teal-700 p-4">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
								BS
							</div>
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-white">Budi Santoso</p>
							<p className="text-xs font-medium text-teal-200">Anggota Tim</p>
						</div>
					</div>
				</div>
			</div>
		</aside>
	)
}
