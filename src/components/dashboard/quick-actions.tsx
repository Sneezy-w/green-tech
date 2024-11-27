import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function QuickActions() {
	return (
		<div className="flex gap-4">
			{/* <Button className="bg-green-600 font-medium text-white hover:bg-green-700">
				<Link
					href="/protected/mfa"
					className="mt-4 text-primary hover:underline"
				>
					Configure Two-Factor Authentication
				</Link>
			</Button> */}
			<Button asChild variant={'outline'}>
				<Link href="/protected/mfa">Configure Two-Factor Authentication</Link>
			</Button>
			{/* <Button
				variant="outline"
				className="border-gray-300 text-gray-700 hover:bg-gray-50"
			>
				Generate Report
			</Button> */}
		</div>
	)
}
