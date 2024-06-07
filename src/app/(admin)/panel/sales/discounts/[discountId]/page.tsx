import { auth } from "@/auth";
import BrandForm from "@/forms/product/brand/BrandForm";
import DiscountForm from "@/forms/sale/discount/DiscountForm";
import prisma from "@/lib/prismadb";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function Page({
	params
}: {
	params: {
		discountId: number | "new";
	};
}) {
	const session = await auth();
	if (!session) return redirect("/signIn", RedirectType.replace);
	const discount = await prisma.discount
		.findUnique({
			where: {
				id: Number(params.discountId) || undefined
			}
		})
		.catch(() => null);

	if (!discount && params.discountId !== "new") {
		notFound();
	}

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				<DiscountForm discount={discount} session={session} types={DISCOUNT_TYPES} />
			</div>
		</div>
	);
}

const DISCOUNT_TYPES = [
	{
		value: "PERCENTAGE",
		label: "Porcentaje"
	},
	{
		value: "AMOUNT",
		label: "Monto"
	}
];
