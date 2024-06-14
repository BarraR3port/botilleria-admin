import { auth } from "@/auth";
import ProductForm from "@/forms/product/ProductForm";
import prisma from "@/lib/prismadb";
import type { Discount } from "@prisma/client";
import { RedirectType, redirect } from "next/navigation";

export default async function Product() {
	const session = await auth();

	if (!session) redirect("/signIn", RedirectType.replace);

	const brands = await prisma.brand.findMany({}).catch(() => []);

	const discounts = await prisma.discount
		.findMany({
			where: {
				active: true
			}
		})
		.catch(() => []);

	const discountsWithEmpty: Discount[] = [
		{
			id: -1,
			name: "Sin descuento"
		} as any,
		...discounts
	];

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				<ProductForm
					product={null}
					brands={brands}
					discounts={discountsWithEmpty}
					types={PRODUCT_TYPES}
					session={session}
				/>
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
