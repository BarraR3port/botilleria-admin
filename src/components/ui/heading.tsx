interface HeadingProps {
	title: string;
	description: string;
}

export default function Heading({ title, description }: HeadingProps) {
	return (
		<div className="space-y-1">
			<h2 className="text-3xl font-bold tracking-right">{title}</h2>
			<p className="text-sm text-muted-foreground">{description}</p>
		</div>
	);
}
