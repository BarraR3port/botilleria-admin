import { auth } from "@/auth";
import NewUserForm from "@/forms/user/NewUserForm";
import UserForm from "@/forms/user/UserForm";
import prisma from "@/lib/prismadb";
import { notFound, redirect, RedirectType } from "next/navigation";

export default async function Product({
	params
}: {
	params: {
		userId: string;
	};
}) {
	const session = await auth();

	if (!session) redirect("/signIn", RedirectType.replace);

	const user = await prisma.user
		.findUnique({
			where: {
				id: params.userId || undefined
			},
			select: {
				id: true,
				name: true,
				lastName: true,
				email: true,
				rol: true,
				rut: true,
				createdAt: true
			}
		})
		.catch(() => null);

	if (!user && params.userId !== "new") {
		notFound();
	}

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				{user && <UserForm user={user} roles={ROLES} session={session} />}
				{!user && params.userId === "new" && <NewUserForm roles={ROLES} session={session} />}
			</div>
		</div>
	);
}

const ROLES = [
	{
		value: "USER",
		label: "Usuario"
	},
	{
		value: "ADMIN",
		label: "Admin"
	}
];
