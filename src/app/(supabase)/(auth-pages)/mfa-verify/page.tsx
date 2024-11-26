import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import MFAVerify from '@/components/mfa/mfa-verify'
import { FormMessage, Message } from '@/components/form-message'

export default async function MFAVerifyPage({
	searchParams,
}: {
	searchParams: Promise<Message>
}) {
	const supabase = await createClient()
	const {
		data: { session },
	} = await supabase.auth.getSession()

	// if no session or no mfa factors, redirect to sign-in
	if (!session || session.user.factors?.length === 0) {
		return redirect('/sign-in')
	}

	return (
		<div className="flex w-full flex-1 flex-col gap-2 text-foreground">
			<form className="mx-auto flex w-full min-w-64 max-w-64 flex-1 flex-col gap-2">
				<div>
					<h1 className="text-2xl font-medium">Two-Factor Authentication</h1>
					<p className="mt-2 text-sm text-secondary-foreground">
						Enter the verification code from your authenticator app.
					</p>
				</div>
				<MFAVerify />
				<FormMessage message={await searchParams} />
			</form>
		</div>
	)
}
