import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";

// Crear un nuevo pedido
export async function POST(req: Request) {
	try {
		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);

		const body = await req.json();

		const { providerId, status, products } = body;

		// Validación de campos requeridos
		if (!providerId)
			return NextResponse.json(
				{ errors: [{ type: "providerId", message: "Proveedor requerido" }] },
				{ status: 400 }
			);
		if (!status)
			return NextResponse.json(
				{ errors: [{ type: "status", message: "Estado del pedido requerido" }] },
				{ status: 400 }
			);
		if (!products || !Array.isArray(products) || products.length === 0)
			return NextResponse.json(
				{ errors: [{ type: "products", message: "Productos requeridos" }] },
				{ status: 400 }
			);

		// Validación de productos y cálculo de totales
		let total = 0;
		let totalWithVAT = 0;
		const VAT = 0.19; // 19% IVA

		for (const item of products) {
			const { productId, quantity, priceWithoutVAT, priceWithVAT } = item;

			if (!productId || !quantity || !priceWithoutVAT || !priceWithVAT) {
				return NextResponse.json(
					{ errors: [{ type: "products", message: "Información incompleta de productos" }] },
					{ status: 400 }
				);
			}

			// Acumular totales
			total += priceWithoutVAT;
			totalWithVAT += priceWithVAT;
		}

		// Crear el pedido en la base de datos
		const order = await prisma.order.create({
			data: {
				total,
				totalWithVAT,
				status,
				user: {
					connect: {
						id: userId
					}
				},
				provider: {
					connect: {
						id: providerId
					}
				},
				products: {
					create: products.map((item: any) => ({
						quantity: item.quantity,
						priceWithoutVAT: item.priceWithoutVAT,
						priceWithVAT: item.priceWithVAT,
						product: {
							connect: {
								id: item.productId
							}
						}
					}))
				}
			}
		});

		products.forEach(async (item: any) => {
			await prisma.product.update({
				where: {
					id: item.productId
				},
				data: {
					stock: {
						increment: item.quantity
					}
				}
			});
		});

		return NextResponse.json(order);
	} catch (error) {
		console.error("[ORDERS][POST]", error);
		return NextResponse.json(
			{
				errors: [
					{
						type: "internal",
						message: "Ocurrió un error interno, por favor contactar soporte"
					}
				]
			},
			{ status: 500 }
		);
	}
}

// Obtener la lista de pedidos
export async function GET(req: Request) {
	try {
		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);

		const { searchParams } = new URL(req.url);
		const status = (searchParams.get("status") as OrderStatus) || undefined;

		// Filtrar pedidos por estado si se proporciona
		const orders = await prisma.order.findMany({
			where: {
				status
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true
					}
				},
				provider: true,
				products: {
					include: {
						product: true
					}
				}
			},
			orderBy: {
				createdAt: "desc"
			}
		});

		return NextResponse.json(orders);
	} catch (error) {
		console.error("[ORDERS][GET]", error);
		return NextResponse.json(
			{
				errors: [
					{
						type: "internal",
						message: "Ocurrió un error interno, por favor contactar soporte"
					}
				]
			},
			{ status: 500 }
		);
	}
}
