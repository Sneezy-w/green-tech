import FetchDataSteps from '@/components/tutorial/fetch-data-steps'
import { createClient } from '@/utils/supabase/server'
import {
	InfoIcon,
	BarChart,
	Users,
	ArrowUpRight,
	ArrowDownRight,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { StatCard } from '@/components/dashboard/stat-card'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { QuickActions } from '@/components/dashboard/quick-actions'

const stats = [
	{
		title: 'Total Projects',
		value: '12',
		change: '+2.5%',
		increasing: true,
		icon: BarChart,
	},
	{
		title: 'Active Users',
		value: '2,345',
		change: '+3.2%',
		increasing: true,
		icon: Users,
	},
	{
		title: 'Carbon Offset',
		value: '45.2t',
		change: '+5.1%',
		increasing: true,
		icon: ArrowUpRight,
	},
	{
		title: 'Energy Savings',
		value: '28.6%',
		change: '-2.3%',
		increasing: false,
		icon: ArrowDownRight,
	},
]

const activities = [
	{
		description: "New project 'Solar Analytics Dashboard' created",
		timeAgo: '2h ago',
	},
	{
		description: 'Energy consumption report generated',
		timeAgo: '2h ago',
	},
	{
		description: 'Team meeting scheduled for sustainability review',
		timeAgo: '2h ago',
	},
	{
		description: 'System maintenance completed',
		timeAgo: '2h ago',
	},
]

export default async function ProtectedPage() {
	const supabase = await createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return redirect('/sign-in')
	}

	return (
		<div className="flex w-full flex-1 flex-col gap-12">
			<div className="w-full">
				<div className="flex items-center gap-3 rounded-md bg-canvas p-3 px-5 text-sm text-foreground">
					<InfoIcon size="16" strokeWidth={2} />
					This is a protected page that you can only see as an authenticated
					user
				</div>
			</div>
			{/* <div className="flex flex-col items-start gap-2">
				<h2 className="mb-4 text-2xl font-bold">Your user details</h2>
				<pre className="max-h-32 overflow-auto rounded border p-3 font-mono text-xs">
					{JSON.stringify(user, null, 2)}
				</pre>
			</div>
			<div>
				<h2 className="mb-4 text-2xl font-bold">Next steps</h2>
				<FetchDataSteps />
			</div> */}

			<div className="">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-gray-900">
							Welcome back, {user?.email}
						</h1>
						<p className="text-gray-600">
							Here's what's happening with your projects today.
						</p>
					</div>

					<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						{stats.map((stat) => (
							<StatCard key={stat.title} {...stat} />
						))}
					</div>

					<ActivityFeed activities={activities} />

					<div className="mt-8">
						<QuickActions />
					</div>
				</div>
			</div>
		</div>
	)
}
