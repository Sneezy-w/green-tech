import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/utils/rate-limit'
import { sanitizeInput } from '@/utils/security'

const limiter = rateLimit({
	interval: 60 * 1000, // 1 minute
	uniqueTokenPerInterval: 500,
})

// Input validation schema
const contactSchema = z.object({
	name: z
		.string()
		.min(2)
		.max(100)
		.regex(/^[A-Za-z0-9\s]+$/),
	email: z.string().email().max(254),
	message: z.string().min(10).max(1000),
	token: z.string(),
})

export async function POST(request: Request) {
	try {
		// Rate limiting
		try {
			await limiter.check(5, 'CONTACT_FORM') // 5 requests per minute
		} catch {
			return NextResponse.json(
				{ error: 'Rate limit exceeded' },
				{ status: 429 },
			)
		}

		const body = await request.json()
		console.log(body)

		// Validate reCAPTCHA
		const recaptchaResponse = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${body.token}`,
			{ method: 'POST' },
		)
		const recaptchaData = await recaptchaResponse.json()

		if (!recaptchaData.success) {
			return NextResponse.json({ error: 'Invalid reCAPTCHA' }, { status: 400 })
		}

		console.log(recaptchaData)

		// Validate and sanitize input
		const validatedData = contactSchema.parse({
			name: sanitizeInput(body.name),
			email: sanitizeInput(body.email),
			message: sanitizeInput(body.message),
			token: body.token,
		})

		// Here you would typically send the email
		// Using your preferred email service (SendGrid, AWS SES, etc.)

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Contact form error:', error)
		return NextResponse.json(
			{ error: 'Failed to send message' },
			{ status: 500 },
		)
	}
}
