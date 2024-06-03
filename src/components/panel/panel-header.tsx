import { cn } from "@/lib/utils";

export default function PanelHeader({ children, title }: { children: React.ReactNode; title?: React.JSX.Element }) {
	return (
		<>
			{title && <header className="flex items-center gap-4 px-6 border-b h-14">{title}</header>}
			<div
				className={cn(
					"flex flex-col flex-1 gap-4 p-4 md:gap-8 ",
					title ? "max-h-[calc(100dvh-3.5rem)]" : "max-h-[calc(100dvh-0rem)]"
				)}
			>
				{children}
			</div>
		</>
	);
}
