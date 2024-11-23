import { signOutAction } from '@/app/actions'
import { hasEnvVars } from '@/utils/supabase/check-env-vars'
import Link from 'next/link'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/server'
import { cn } from '@/lib/utils'

export default async function AuthButton({
	className,
}: React.ComponentProps<'div'>) {
	const supabase = await createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!hasEnvVars) {
		return (
			<div className={cn('flex flex-wrap items-center gap-[.5em]', className)}>
				<div className="">
					<div>
						<Badge
							variant={'default'}
							className="pointer-events-none font-normal"
						>
							Please update .env.local file with anon key and url
						</Badge>
					</div>
					<div className="flex gap-2">
						<Button
							asChild
							size="sm"
							variant={'outline'}
							disabled
							className="pointer-events-none cursor-none opacity-75"
						>
							<Link href="/sign-in">Sign in</Link>
						</Button>
						<Button
							asChild
							size="sm"
							variant={'default'}
							disabled
							className="pointer-events-none cursor-none opacity-75"
						>
							<Link href="/sign-up">Sign up</Link>
						</Button>
					</div>
				</div>
			</div>
		)
	}
	return user ? (
		<div className="flex items-center gap-4">
			<Link href="/protected">Hey, {user.email}!</Link>
			<form action={signOutAction}>
				<Button type="submit" variant={'outline'}>
					Sign out
				</Button>
			</form>
		</div>
	) : (
		<div className="flex gap-2">
			<Button asChild size="sm" variant={'outline'}>
				<Link href="/sign-in">Sign in</Link>
			</Button>
			<Button asChild size="sm" variant={'default'}>
				<Link href="/sign-up">Sign up</Link>
			</Button>
		</div>
	)
}
