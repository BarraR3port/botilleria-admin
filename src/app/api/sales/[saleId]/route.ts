import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	{
		params
	}: {
		params: {
			saleId: number;
		};
	}
) {
	try {
		if (!params.saleId) {
			return NextResponse.json(
				{
					errors: [{ type: "saleId", message: "ID de la venta requerido" }]
				},
				{ status: 400 }
			);
		}

		const sale = await prisma.sale.findUnique({
			where: {
				id: params.saleId
			},
			include: {
				user: {
					select: {
						name: true,
						lastName: true,
						email: true
					}
				},
				products: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								sellPrice: true,
								type: true,
								weightOrVolume: true,
								brand: {
									select: {
										name: true
									}
								}
							}
						}
					}
				}
			}
		});

		return NextResponse.json(sale);
	} catch (error) {
		console.log("[SALES][ID][GET]", error);
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
			saleId: number;
		};
	}
) {
	try {
		if (!params.saleId) {
			return NextResponse.json(
				{
					errors: [{ type: "saleId", message: "ID de la venta requerido" }]
				},
				{ status: 400 }
			);
		}

		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });

		const isUserAdmin = await prisma.user.findUnique({
			where: {
				id: userId,
				rol: "ADMIN"
			}
		});

		if (!isUserAdmin)
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });

		const oldSale = await prisma.sale.findUnique({
			where: {
				id: Number(params.saleId)
			}
		});

		if (!oldSale)
			return NextResponse.json({
				errors: [{ type: "saleId", message: "Venta no encontrada" }],
				status: 404
			});

		const sale = await prisma.sale.delete({
			where: {
				id: Number(params.saleId)
			}
		});

		return NextResponse.json(sale);
	} catch (error) {
		console.log("[SALES][ID][DELETE]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}
