export default async function Layout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex flex-col items-center">
			<div className="flex max-w-5xl flex-col gap-20 p-5">
				<div className="flex max-w-7xl flex-col items-start gap-12">
					{children}
				</div>
			</div>
		</div>
	)
}
