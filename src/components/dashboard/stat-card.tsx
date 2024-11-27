import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface StatCardProps {
	title: string
	value: string
	change: string
	increasing: boolean
	icon: LucideIcon
}

export function StatCard({
	title,
	value,
	change,
	increasing,
	icon: Icon,
}: StatCardProps) {
	return (
		<Card className="bg-white p-6">
			<div className="mb-4 flex items-center justify-between">
				<Icon className="h-6 w-6 text-gray-500" />
				<span
					className={`text-sm font-medium ${
						increasing ? 'text-green-600' : 'text-red-600'
					}`}
				>
					{change}
				</span>
			</div>
			<h3 className="text-sm font-medium text-gray-700">{title}</h3>
			<p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
		</Card>
	)
}
