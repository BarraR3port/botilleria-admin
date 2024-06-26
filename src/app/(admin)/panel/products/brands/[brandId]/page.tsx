import { auth } from "@/auth";
import BrandForm from "@/forms/product/brand/BrandForm";
import prisma from "@/lib/prismadb";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function Page({
	params
}: {
	params: {
		brandId: string;
	};
}) {
	const session = await auth();
	if (!session) redirect("/signIn", RedirectType.replace);
	const brand = await prisma.brand
		.findUnique({
			where: {
				id: params.brandId || undefined
			}
		})
		.catch(() => null);

	if (!brand && params.brandId !== "create") {
		notFound();
	}

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				<BrandForm brand={brand} session={session} />
			</div>
		</div>
	);
}
