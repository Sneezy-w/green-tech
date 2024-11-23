import { createClient } from '@/utils/supabase/server'
import MFASetup from '@/components/mfa/mfa-setup'
import { redirect } from 'next/navigation'

export default async function MFAPage() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return redirect('/sign-in')
	}

	const { data, error } =
		await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
	if (error) {
		throw error
	}

	console.log(data)

	const { data: factors } = await supabase.auth.mfa.listFactors()

	console.log(factors)

	let mfaStatus = 'verify'
	if (data.nextLevel === 'aal2' && data.currentLevel !== 'aal2') {
		mfaStatus = 'enabled'
	} else if (data.currentLevel === 'aal1' && data.nextLevel === 'aal1') {
		mfaStatus = 'need-setup'
	} else {
		mfaStatus = 'need-verify'
	}

	return (
		<div className="mx-auto flex max-w-xl flex-1 flex-col gap-8 p-4">
			<h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
			<MFASetup
				initialFactors={factors?.all || []}
				currentLevel={data.currentLevel || ''}
				nextLevel={data.nextLevel || ''}
			/>
		</div>
	)
}
