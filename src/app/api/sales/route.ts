import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });

		const body = await req.json();

		const { total, products } = body;

		if (!products || !products.length)
			return NextResponse.json(
				{ errors: [{ type: "products", message: "Productos requeridos" }] },
				{ status: 400 }
			);

		if (!total)
			return NextResponse.json({ errors: [{ type: "total", message: "Total requerido" }] }, { status: 400 });

		const sale = await prisma.sale.create({
			data: {
				total,
				user: {
					connect: {
						id: userId
					}
				},
				products: {
					create: products.map((product: any) => ({
						product: {
							connect: {
								id: product.id
							}
						},
						quantity: product.quantity,
						price: product.price,
						finalPrice: product.finalPrice,
						appliedDiscount: product.appliedDiscount
					}))
				}
			}
		});

		return NextResponse.json(sale);
	} catch (error) {
		console.log("[PRODUCTS][POST]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}

export async function GET(req: Request) {
	try {
		const auth = await getAuth(req);

		if (!auth) {
			return NextResponse.json({
				errors: [{ type: "unauthorized", message: "No autorizado" }],
				status: 401
			});
		}

		const sales = await prisma.sale.findMany({
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
								sellPrice: true
							}
						}
					}
				}
			},
			orderBy: {
				createdAt: "desc"
			}
		});

		return NextResponse.json(sales);
	} catch (error) {
		console.log("[SALES][GET]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}
