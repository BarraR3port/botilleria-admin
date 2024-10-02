import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });

		const body = await req.json();

		const { total, products, totalDiscount, type } = body;

		if (!products || !products.length)
			return NextResponse.json(
				{ errors: [{ type: "products", message: "Productos requeridos" }] },
				{ status: 400 }
			);

		if (!total)
			return NextResponse.json({ errors: [{ type: "total", message: "Total requerido" }] }, { status: 400 });

		if (!type) {
			return NextResponse.json({ errors: [{ type: "type", message: "Tipo requerido" }], status: 400 });
		}

		const productIds = products.map((product: any) => product.item.id);

		const productsFound = await prisma.product.findMany({
			where: {
				id: {
					in: productIds
				}
			},
			include: {
				brand: {
					select: {
						name: true
					}
				}
			}
		});

		if (productsFound.length !== products.length) {
			return NextResponse.json({
				errors: [{ type: "products", message: "Productos no encontrados" }],
				status: 400
			});
		}

		// check if products are available

		for (const product of products) {
			const productFound = productsFound.find(p => p.id === product.item.id);
			if (!productFound) {
				return NextResponse.json({
					errors: [{ type: "product", message: `Producto no encontrado ${product.item.id}` }],
					status: 400
				});
			}
			if (product.quantity > productFound.stock) {
				return NextResponse.json({
					errors: [
						{
							type: "stock",
							message: `No hay suficiente stock para el producto ${productFound.name} - ${productFound.brand.name}  [${productFound.stock} disponible/s]`
						}
					],
					status: 400
				});
			}
		}

		const sale = await prisma.sale.create({
			data: {
				total,
				totalDiscount: totalDiscount || 0,
				type,
				user: {
					connect: {
						id: userId
					}
				},
				products: {
					create: products.map((product: any) => ({
						product: {
							connect: {
								id: product.item.id
							}
						},
						quantity: product.quantity,
						price: product.price,
						finalPrice: product.finalPrice,
						appliedDiscount: product.appliedDiscount,
						originalPrice: product.originalPrice
					}))
				}
			}
		});

		// update stock

		for (const product of products) {
			const dbProduct = productsFound.find(p => p.id === product.item.id);
			if (!dbProduct) continue;
			await prisma.product.update({
				where: {
					id: product.item.id
				},
				data: {
					stock: {
						decrement: product.quantity
					},
					available: {
						set: dbProduct.stock - product.quantity > 0
					}
				}
			});
		}

		return NextResponse.json(sale);
	} catch (error) {
		console.log("[SALES][POST]", error);
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
