import { Card } from '@/components/ui/card'

interface ActivityItem {
	description: string
	timeAgo: string
}

interface ActivityFeedProps {
	activities: ActivityItem[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
	return (
		<Card className="bg-white p-6">
			<h2 className="mb-4 text-lg font-semibold text-gray-900">
				Recent Activity
			</h2>
			<div className="space-y-4">
				{activities.map((activity, index) => (
					<div
						key={index}
						className="flex items-center justify-between border-b py-3 last:border-0"
					>
						<span className="text-gray-700">{activity.description}</span>
						<span className="text-sm text-gray-500">{activity.timeAgo}</span>
					</div>
				))}
			</div>
		</Card>
	)
}
