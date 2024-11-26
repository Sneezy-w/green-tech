'use client'

import { useCallback, useState } from 'react'
import { PortableText } from 'next-sanity'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { sanitizeInput } from '@/utils/security'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
interface ContactFormProps {
	title?: string
	description?: any
	successMessage?: string
}

export default function ContactForm(props: ContactFormProps) {
	return (
		<GoogleReCaptchaProvider
			reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
		>
			<ContactFormContent {...props} />
		</GoogleReCaptchaProvider>
	)
}

function ContactFormContent({
	title,
	description,
	successMessage = 'Thank you for your message!',
}: ContactFormProps) {
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle')
	const [error, setError] = useState('')
	const { executeRecaptcha } = useGoogleReCaptcha()

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			setStatus('loading')
			setError('')

			try {
				if (!executeRecaptcha) {
					throw new Error('reCAPTCHA not initialized')
				}

				const token = await executeRecaptcha('contact_form')

				console.log(e)
				const formData = new FormData(e.target as HTMLFormElement)
				const data = {
					name: sanitizeInput(formData.get('name') as string),
					email: sanitizeInput(formData.get('email') as string),
					message: sanitizeInput(formData.get('message') as string),
					token,
				}

				const response = await fetch('/api/contact', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				})

				if (!response.ok) {
					throw new Error('Failed to send message')
				}

				setStatus('success')
				//(e.target as HTMLFormElement).reset()
			} catch (err: any) {
				setError(err.message)
				setStatus('error')
			}
		},
		[executeRecaptcha],
	)

	return (
		// <GoogleReCaptchaProvider
		// 	reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
		// >
		<section className="section space-y-8">
			{(title || description) && (
				<header className="richtext mx-auto max-w-2xl text-center">
					{title && <h2 className="text-2xl font-bold">{title}</h2>}
					{description && <PortableText value={description} />}
				</header>
			)}

			<form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4">
				<div>
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						name="name"
						required
						minLength={2}
						maxLength={100}
						pattern="[A-Za-z0-9\s]+"
						title="Name can only contain letters, numbers and spaces"
					/>
				</div>

				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						required
						maxLength={254}
					/>
				</div>

				<div>
					<Label htmlFor="message">Message</Label>
					<Textarea
						id="message"
						name="message"
						required
						minLength={10}
						maxLength={1000}
					/>
				</div>

				<Button
					type="submit"
					disabled={status === 'loading'}
					className="w-full"
				>
					{status === 'loading' ? 'Sending...' : 'Send Message'}
				</Button>

				{status === 'success' && (
					<p className="text-center text-green-600">{successMessage}</p>
				)}

				{status === 'error' && (
					<p className="text-center text-red-600">{error}</p>
				)}
			</form>
		</section>
		// </GoogleReCaptchaProvider>
	)
}
