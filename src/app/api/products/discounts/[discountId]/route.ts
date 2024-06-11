import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	{
		params
	}: {
		params: {
			discountId: number;
		};
	}
) {
	try {
		if (!params.discountId) {
			return NextResponse.json(
				{
					errors: [{ type: "discountId", message: "ID del descuento requerido" }]
				},
				{ status: 400 }
			);
		}

		const discount = await prisma.discount.findFirst({
			where: {
				id: Number(params.discountId)
			}
		});

		return NextResponse.json(discount);
	} catch (error) {
		console.log("[PRODUCTS][DISCOUNT][ID][GET]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}

export async function PATCH(
	req: Request,
	{
		params
	}: {
		params: {
			discountId: number;
		};
	}
) {
	try {
		if (!params.discountId) {
			return NextResponse.json(
				{ errors: [{ type: "discountId", message: "ID del descuento requerido" }] },
				{ status: 400 }
			);
		}

		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);

		const body = await req.json();

		const { name, description, type, active, value } = body;

		if (!name) return NextResponse.json({ errors: [{ type: "name", message: "Nombre requerido" }], status: 400 });

		if (!type) return NextResponse.json({ errors: [{ type: "type", message: "Tipo requerido" }], status: 400 });

		if (active === undefined)
			return NextResponse.json({ errors: [{ type: "active", message: "Activo requerido" }], status: 400 });

		if (!value) return NextResponse.json({ errors: [{ type: "value", message: "Valor requerido" }], status: 400 });

		const discount = await prisma.discount.findFirst({
			where: {
				id: Number(params.discountId)
			}
		});

		if (!discount)
			return NextResponse.json({
				errors: [{ type: "discount", message: "Descuento no encontrado" }],
				status: 404
			});

		const newDiscount = await prisma.discount.update({
			where: {
				id: Number(params.discountId)
			},
			data: {
				name,
				description,
				type,
				active,
				value
			}
		});

		return NextResponse.json(newDiscount);
	} catch (error) {
		console.log("[PRODUCTS][DISCOUNT][ID][PATCH]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}

export async function DELETE(
	req: Request,
	{
		params
	}: {
		params: {
			discountId: string;
		};
	}
) {
	try {
		if (!params.discountId) {
			return NextResponse.json(
				{
					errors: [{ type: "discountId", message: "ID del descuento requerido" }]
				},
				{ status: 400 }
			);
		}

		const userId = await getAuth(req);

		if (!userId)
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);

		const isUserAdmin = await prisma.user.findUnique({
			where: {
				id: userId,
				rol: "ADMIN"
			}
		});

		if (!isUserAdmin)
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);

		const oldDiscount = await prisma.discount.findFirst({
			where: {
				id: Number(params.discountId)
			}
		});

		if (!oldDiscount)
			return NextResponse.json({
				errors: [{ type: "discount", message: "Descuento no encontrado" }],
				status: 404
			});

		const discount = await prisma.discount.delete({
			where: {
				id: Number(params.discountId)
			}
		});

		return NextResponse.json(discount);
	} catch (error) {
		console.log("[PRODUCTS][DISCOUNT][ID][DELETE]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}
