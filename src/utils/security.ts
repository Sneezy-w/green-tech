import DOMPurify from 'isomorphic-dompurify'

export function sanitizeInput(input: string): string {
	if (!input) return ''

	// Remove any HTML/script tags
	const sanitized = DOMPurify.sanitize(input, {
		ALLOWED_TAGS: [], // No HTML tags allowed
		ALLOWED_ATTR: [], // No attributes allowed
	})

	// Additional sanitization
	return sanitized
		.trim()
		.replace(/[<>]/g, '') // Remove any remaining angle brackets
		.replace(/[^\w\s@.-]/g, '') // Only allow alphanumeric, spaces, @, dots and hyphens
}

export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}
