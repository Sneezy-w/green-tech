// import { GoogleTagManager } from '@next/third-parties/google'
import SkipToContent from '@/ui/SkipToContent'
import Announcement from '@/ui/Announcement'
import Header from '@/ui/header'
import Footer from '@/ui/footer'
import VisualEditingControls from '@/ui/VisualEditingControls'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/styles/app.css'

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			{/* <GoogleTagManager gtmId='' /> */}

			<body className="bg-canvas text-ink">
				<SkipToContent />
				<Announcement />
				<div className="flex min-h-screen flex-col">
					<Header />
					<main id="main-content" tabIndex={-1} className="flex-grow">
						<div className="flex flex-col items-center">
							<div className="flex max-w-5xl flex-col gap-20 p-5">
								<div className="flex max-w-7xl flex-col items-start gap-12">
									{children}
								</div>
							</div>
						</div>
					</main>
					<Footer />
				</div>
				<VisualEditingControls />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	)
}
