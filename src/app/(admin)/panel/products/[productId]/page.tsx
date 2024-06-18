import { auth } from "@/auth";
import ProductInfo from "@/components/panel/products/product-info";
import prisma from "@/lib/prismadb";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function Product({
	params
}: {
	params: {
		productId: number | "create";
	};
}) {
	const session = await auth();

	if (!session) redirect("/signIn", RedirectType.replace);

	const product = await prisma.product
		.findUnique({
			where: {
				id: Number(params.productId) || undefined
			},
			include: {
				discount: true,
				brand: {
					select: {
						name: true
					}
				}
			}
		})
		.catch(() => null);

	if (!product && params.productId === "create") {
		redirect("/panel/products/create");
	}

	if (!product) {
		notFound();
	}

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				<ProductInfo product={product as any} types={PRODUCT_TYPES} session={session} />
			</div>
		</div>
	);
}

const PRODUCT_TYPES = [
	{
		value: "FOOD",
		label: "Comida"
	},
	{
		value: "DRINK",
		label: "Bebida"
	},
	{
		value: "OTHER",
		label: "Otro"
	}
];
