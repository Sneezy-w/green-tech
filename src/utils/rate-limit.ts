export interface RateLimiterOptions {
	interval: number // Time window in milliseconds
	uniqueTokenPerInterval?: number // Max number of unique tokens per interval
}

export interface RateLimiter {
	check: (limit: number, token: string) => Promise<void>
}

export function rateLimit(options: RateLimiterOptions): RateLimiter {
	const tokenCache = new Map()
	const { interval, uniqueTokenPerInterval = 500 } = options

	return {
		check: (limit: number, token: string): Promise<void> => {
			const now = Date.now()
			const tokenCount = tokenCache.get(token) || [0, now]
			const [count, timestamp] = tokenCount

			// Reset count if outside interval
			const currentCount = now - timestamp > interval ? 0 : count

			// Check if limit exceeded
			if (currentCount >= limit) {
				return Promise.reject(new Error('Rate limit exceeded'))
			}

			// Update token cache
			tokenCache.set(token, [currentCount + 1, now])

			// Clean old entries
			if (tokenCache.size > uniqueTokenPerInterval) {
				const oldestToken = Array.from(tokenCache.entries()).sort(
					([, a], [, b]) => a[1] - b[1],
				)[0][0]
				tokenCache.delete(oldestToken)
			}

			return Promise.resolve()
		},
	}
}

// Example usage:
// const limiter = rateLimit({
//   interval: 60 * 1000, // 1 minute
//   uniqueTokenPerInterval: 500
// })
//
// try {
//   await limiter.check(5, 'CONTACT_FORM') // 5 requests per minute
// } catch (error) {
//   // Handle rate limit exceeded
// }
