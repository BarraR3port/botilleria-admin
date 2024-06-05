import { Client } from "@/components/panel/users/list/Client";
import type { Column } from "@/components/panel/users/list/Column";
import prisma from "@/lib/prismadb";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function UsersPage() {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			lastName: true,
			rut: true,
			createdAt: true,
			rol: true
		},
		orderBy: {
			createdAt: "desc"
		}
	});

	const formattedUsers: Column[] = users.map(user => {
		return {
			id: user.id.toString(),
			name: `${user.name} ${user.lastName}`,
			rut: user.rut,
			rol: user.rol,
			createdAt: format(user.createdAt, "dd MMMM yy HH:mm", {
				locale: es
			})
		};
	});

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				<Client users={formattedUsers} />
			</div>
		</div>
	);
}
