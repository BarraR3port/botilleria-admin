import { auth } from "@/auth";
import type { RolType } from "@prisma/client";
interface RouteProtectorProps {
	children: React.ReactNode;
	rol?: RolType;
}

export default async function RouteProtector({ children, rol }: RouteProtectorProps) {
	const session = await auth();
	if (!session) {
		return null;
	}

	if (rol && session.user.rol !== rol) {
		return null;
	}
	return <>{children}</>;
}
