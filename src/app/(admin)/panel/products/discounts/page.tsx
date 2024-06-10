import { Client } from "@/components/panel/products/discounts/list/Client";
import type { Column } from "@/components/panel/products/discounts/list/Column";
import prisma from "@/lib/prismadb";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function Discounts() {
	const discounts = await prisma.discount.findMany({
		orderBy: {
			createdAt: "desc"
		}
	});

	const formattedDiscounts: Column[] = discounts.map(discount => {
		return {
			id: discount.id.toString(),
			name: discount.name,
			description: discount.description,
			type: discount.type,
			value: discount.value.toString(),
			createdAt: format(discount.createdAt, "dd MMMM yy HH:mm", {
				locale: es
			})
		};
	});

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				<Client discounts={formattedDiscounts} />
			</div>
		</div>
	);
}
