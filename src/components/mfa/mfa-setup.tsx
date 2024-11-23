'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QRCodeSVG } from 'qrcode.react'
import { Factor } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

import Image from 'next/image'
export default function MFASetup({
	initialFactors,
	currentLevel,
	nextLevel,
}: {
	initialFactors: Factor[]
	currentLevel: string
	nextLevel: string
}) {
	const [factor, setFactor] = useState(initialFactors[0])
	//const [qrCode, setQrCode] = useState(null)
	const [enrollData, setEnrollData] = useState<any>(null)
	const [factorId, setFactorId] = useState<string>(initialFactors[0]?.id || '')
	const [challengeData, setChallengeData] = useState<any>(null)
	const [verificationCode, setVerificationCode] = useState('')
	const [error, setError] = useState('')
	const [mfaStatus, setMfaStatus] = useState(currentLevel)

	const supabase = createClient()

	useEffect(() => {
		if (factor?.status === 'verified') {
			setMfaStatus('enabled')
		} else if (factor?.status === 'unverified') {
			setMfaStatus('need-verify')
		} else {
			setMfaStatus('need-setup')
		}
	}, [factor])

	const enrollMFA = async () => {
		try {
			const { data, error } = await supabase.auth.mfa.enroll({
				factorType: 'totp',
			})

			if (error) throw new Error('Failed to enroll MFA')

			// Use the id to create a challenge.
			// The challenge can be verified by entering the code generated from the authenticator app.
			// The code will be generated upon scanning the qr_code or entering the secret into the authenticator app.
			const { id, type, totp, friendly_name } = data
			setEnrollData(data)
			setFactorId(id)
		} catch (error: any) {
			setError(error.message)
		}
	}

	const verifyMFA = async () => {
		try {
			const { data: challengeData, error: challengeError } =
				await supabase.auth.mfa.challenge({ factorId })

			if (challengeError) throw new Error('Failed to create challenge')

			setChallengeData(challengeData)

			const verify = await supabase.auth.mfa.verify({
				factorId,
				challengeId: challengeData.id,
				code: verificationCode,
			})
			if (verify.error) {
				setError(verify.error.message)
				throw verify.error
			}

			//setFactors([...factors, data])
			setMfaStatus('enabled')
			setEnrollData(null)
			setVerificationCode('')
		} catch (error: any) {
			setError(error.message)
		}
	}

	const disableMFA = async () => {
		try {
			const { data, error } = await supabase.auth.mfa.unenroll({ factorId })
			if (error) throw new Error('Failed to disable MFA')
			setMfaStatus('need-setup')
		} catch (error: any) {
			setError(error.message)
		}
	}

	return (
		<div className="space-y-6">
			{mfaStatus === 'need-setup' ? (
				<div className="text-center">
					<p className="mb-4">You haven't set up 2FA yet.</p>
					<Button onClick={enrollMFA}>Set up 2FA</Button>
				</div>
			) : mfaStatus === 'enabled' ? (
				<div>
					<p className="text-green-600">✓ 2FA is enabled</p>
					<Button variant="destructive" onClick={disableMFA}>
						Disable 2FA
					</Button>
				</div>
			) : (
				<div>
					<p className="text-yellow-600">2FA needs to be verified</p>
					<div>
						<Input
							type="text"
							placeholder="Enter verification code"
							value={verificationCode}
							onChange={(e) => setVerificationCode(e.target.value)}
						/>
						<Button onClick={verifyMFA} className="mt-2">
							Verify
						</Button>
						<Button
							variant="destructive"
							className="ml-2 mt-2"
							onClick={disableMFA}
						>
							Disable 2FA
						</Button>
					</div>
				</div>
			)}

			{enrollData && (
				<div className="space-y-4">
					<p>Scan this QR code with your authenticator app:</p>
					<div className="flex items-center justify-center bg-white p-4">
						<img src={enrollData.totp.qr_code} alt={enrollData.totp.uri} />
					</div>
					<div>
						<Input
							type="text"
							placeholder="Enter verification code"
							value={verificationCode}
							onChange={(e) => setVerificationCode(e.target.value)}
						/>
						<Button onClick={verifyMFA} className="mt-2">
							Verify
						</Button>
					</div>
				</div>
			)}

			{error && <p className="text-red-500">{error}</p>}
		</div>
	)
}
