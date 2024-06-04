import { Client } from "@/components/panel/products/brands/list/Client";
import type { Column } from "@/components/panel/products/brands/list/Column";
import prisma from "@/lib/prismadb";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function Ventas() {
	const brands = await prisma.brand.findMany({
		orderBy: {
			createdAt: "desc"
		}
	});

	const formattedBrands: Column[] = brands.map(brand => {
		return {
			id: brand.id,
			name: brand.name,
			description: brand.description,
			createdAt: format(brand.createdAt, "dd MMMM yy HH:mm", {
				locale: es
			})
		};
	});

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-5 pt-6">
				<Client brands={formattedBrands} />
			</div>
		</div>
	);
}
