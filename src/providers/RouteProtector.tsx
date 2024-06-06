import { auth } from "@/auth";
import type { RolType } from "@prisma/client";
import { redirect, RedirectType } from "next/navigation";
interface RouteProtectorProps {
	children: React.ReactNode;
	rol?: RolType;
}

export default async function RouteProtector({ children, rol }: RouteProtectorProps) {
	const session = await auth();
	if (!session) {
		redirect("/signIn", RedirectType.replace);
	}

	if (rol && session.user.rol !== rol) {
		if (!session) {
			redirect("/signIn", RedirectType.replace);
		}
	}
	return <>{children}</>;
}
