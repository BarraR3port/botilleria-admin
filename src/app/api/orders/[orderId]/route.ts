import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

interface Params {
	params: {
		orderId: string;
	};
}

// Obtener un pedido específico
export async function GET(_req: Request, { params }: Params) {
	try {
		const userId = await getAuth(_req);
		if (!userId)
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);

		const { orderId } = params;
		if (!orderId)
			return NextResponse.json(
				{ errors: [{ type: "orderId", message: "ID del pedido requerido" }] },
				{ status: 400 }
			);

		const order = await prisma.order.findUnique({
			where: {
				id: Number(orderId)
			},
			include: {
				user: true,
				provider: true,
				products: {
					include: {
						product: true
					}
				}
			}
		});

		if (!order)
			return NextResponse.json(
				{ errors: [{ type: "not_found", message: "Pedido no encontrado" }] },
				{ status: 404 }
			);

		return NextResponse.json(order);
	} catch (error) {
		console.error("[ORDERS][ID][GET]", error);
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

// Actualizar un pedido específico
export async function PATCH(req: Request, { params }: Params) {
	try {
		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);

		const { orderId } = params;
		if (!orderId)
			return NextResponse.json(
				{ errors: [{ type: "orderId", message: "ID del pedido requerido" }] },
				{ status: 400 }
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

		// Actualizar el pedido y sus productos
		const order = await prisma.order.update({
			where: {
				id: Number(orderId)
			},
			data: {
				total,
				totalWithVAT,
				status,
				provider: {
					connect: {
						id: providerId
					}
				},
				products: {
					deleteMany: {}, // Elimina los productos existentes
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

		return NextResponse.json(order);
	} catch (error) {
		console.error("[ORDERS][ID][PATCH]", error);
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

// Eliminar un pedido específico
export async function DELETE(req: Request, { params }: Params) {
	try {
		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);

		const { orderId } = params;
		if (!orderId)
			return NextResponse.json(
				{ errors: [{ type: "orderId", message: "ID del pedido requerido" }] },
				{ status: 400 }
			);

		// Verificar si el usuario es administrador
		const user = await prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if (user?.rol !== "ADMIN") {
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);
		}

		// Eliminar el pedido y sus productos asociados
		await prisma.orderItem.deleteMany({
			where: {
				orderId: Number(orderId)
			}
		});

		const order = await prisma.order.delete({
			where: {
				id: Number(orderId)
			}
		});

		return NextResponse.json(order);
	} catch (error) {
		console.error("[ORDERS][ID][DELETE]", error);
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
