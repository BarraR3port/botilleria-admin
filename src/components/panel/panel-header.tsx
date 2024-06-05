import { cn } from "@/lib/utils";

export default function PanelHeader({ children }: { children: React.ReactNode }) {
	return <div className={cn("flex flex-col flex-1 gap-4 p-4 md:gap-8 max-h-full")}>{children}</div>;
}
