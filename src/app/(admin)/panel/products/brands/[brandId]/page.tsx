import { auth } from "@/auth";
import BrandForm from "@/forms/product/brand/BrandForm";
import prisma from "@/lib/prismadb";

export default async function Page({
	params
}: {
	params: {
		brandId: string;
	};
}) {
	const session = await auth();
	if (!session) return { redirect: { destination: "/signIn", permanent: false } };
	const brand = await prisma.brand
		.findUnique({
			where: {
				id: params.brandId || undefined
			}
		})
		.catch(() => null);

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-5 pt-6">
				<BrandForm brand={brand} session={session} />
			</div>
		</div>
	);
}
