import ProductForm from "@/forms/product/ProductForm";
import prisma from "@/lib/prismadb";
import { ProductType } from "@prisma/client";
import React from "react";

export default async function Page({
	params
}: {
	params: {
		productId: number;
		storeId: string;
	};
}) {
	const product = await prisma.product
		.findUnique({
			where: {
				id: params.productId || undefined
			},
			include: {
				discounts: true,
				brand: {
					select: {
						name: true
					}
				}
			}
		})
		.catch(() => null);

	const brands = await prisma.brand.findMany({}).catch(() => []);

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-5 pt-6">
				<ProductForm product={product} brands={brands} types={PRODUCT_TYPES} />
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
