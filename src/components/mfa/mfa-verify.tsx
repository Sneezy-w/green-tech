'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import { createClient } from '@/utils/supabase/client'
export default function MFAVerify() {
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)
	const supabase = createClient()

	const handleSubmit = useCallback(
		async (formData: FormData) => {
			const code = formData.get('code') as string

			try {
				const factors = await supabase.auth.mfa.listFactors()
				if (factors.error) {
					throw factors.error
				}

				const totpFactor = factors.data.all[0]

				if (!totpFactor) {
					throw new Error('No TOTP factors found!')
				}
				const factorId = totpFactor.id

				const { data, error } = await supabase.auth.mfa.challengeAndVerify({
					factorId,
					code,
				})

				if (error) {
					setError(error.message)
					return
				}

				// 验证成功后重定向到受保护页面
				router.push('/protected')
			} catch (error: any) {
				setError(error.message)
			}
		},
		[router],
	)

	return (
		<div className="flex flex-col gap-2">
			<div className="mt-4 flex flex-col gap-2">
				<Label htmlFor="code">Verification Code</Label>
				<Input
					id="code"
					name="code"
					type="text"
					placeholder="Enter 6-digit code"
					maxLength={6}
					pattern="[0-9]*"
					inputMode="numeric"
					autoComplete="one-time-code"
					required
				/>
			</div>

			<SubmitButton
				className="mt-4"
				formAction={handleSubmit}
				pendingText="Verifying..."
			>
				Verify
			</SubmitButton>

			{error && <p className="mt-2 text-sm text-destructive">{error}</p>}
		</div>
	)
}
