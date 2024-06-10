import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	{
		params
	}: {
		params: {
			productId: number;
		};
	}
) {
	try {
		if (!params.productId) {
			return NextResponse.json(
				{
					errors: [{ type: "productId", message: "ID del producto requerido" }]
				},
				{ status: 400 }
			);
		}

		const product = await prisma.product.findFirst({
			where: {
				id: params.productId
			},
			include: {
				discount: true,
				brand: {
					select: {
						name: true
					}
				}
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCTS][ID][GET]", error);
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
			productId: number;
		};
	}
) {
	try {
		if (!params.productId) {
			return NextResponse.json(
				{
					errors: [{ type: "productId", message: "ID del producto requerido" }]
				},
				{ status: 400 }
			);
		}

		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });

		const body = await req.json();

		const {
			name,
			description,
			barcode,
			stock,
			sellPrice,
			costPrice,
			weightOrVolume,
			brandId,
			type,
			available,
			discountId
		} = body;

		if (!name) return NextResponse.json({ errors: [{ type: "name", message: "Nombre requerido" }], status: 400 });
		if (!barcode)
			return NextResponse.json(
				{
					errors: [{ type: "barcode", message: "Código de barras requerido" }]
				},
				{ status: 400 }
			);
		if (!stock) return NextResponse.json({ errors: [{ type: "stock", message: "Stock requerido" }], status: 400 });
		if (!sellPrice)
			return NextResponse.json(
				{
					errors: [{ type: "sellPrice", message: "Precio de venta requerido" }]
				},
				{ status: 400 }
			);
		if (!costPrice)
			return NextResponse.json(
				{
					errors: [{ type: "costPrice", message: "Precio de costo requerido" }]
				},
				{ status: 400 }
			);
		if (!weightOrVolume)
			return NextResponse.json(
				{
					errors: [{ type: "weightOrVolume", message: "Peso o volumen requerido" }]
				},
				{ status: 400 }
			);
		if (!brandId)
			return NextResponse.json(
				{ errors: [{ type: "brandId", message: "Marca requerida" }], status: 400 },
				{ status: 400 }
			);
		if (!type)
			return NextResponse.json(
				{ errors: [{ type: "type", message: "Tipo requerido" }], status: 400 },
				{ status: 400 }
			);
		if (available === undefined)
			return NextResponse.json(
				{
					errors: [{ type: "available", message: "Disponibilidad requerida" }]
				},
				{ status: 400 }
			);

		const oldProduct = await prisma.product.findFirst({
			where: {
				id: Number(params.productId)
			}
		});
		if (!oldProduct)
			return NextResponse.json(
				{
					errors: [{ type: "productId", message: "Producto no encontrado" }],
					status: 404
				},
				{ status: 400 }
			);

		if (discountId) {
			const discount = await prisma.discount.findFirst({
				where: {
					id: discountId
				}
			});

			if (!discount) {
				return NextResponse.json({
					errors: [{ type: "discountId", message: "Descuento no encontrado" }],
					status: 404
				});
			}
		}

		const brand = await prisma.brand.findFirst({
			where: {
				id: brandId
			}
		});

		if (!brand)
			return NextResponse.json({ errors: [{ type: "brandId", message: "Marca no encontrada" }], status: 404 });

		const product = await prisma.product.update({
			where: {
				id: Number(params.productId)
			},
			data: {
				name,
				description,
				stock,
				sellPrice,
				costPrice,
				weightOrVolume,
				type,
				available,
				barcode,
				discount: discountId
					? {
							connect: {
								id: discountId
							}
						}
					: {
							disconnect: true
						},
				brand: {
					connect: {
						id: brandId
					}
				}
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCTS][ID][PATCH]", error);
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
			productId: number;
		};
	}
) {
	try {
		if (!params.productId) {
			return NextResponse.json(
				{
					errors: [{ type: "productId", message: "ID del producto requerido" }]
				},
				{ status: 400 }
			);
		}

		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });

		const isUserAdmin = await prisma.user.findFirst({
			where: {
				id: userId
			}
		});

		if (!isUserAdmin)
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });

		const oldProduct = await prisma.product.findFirst({
			where: {
				id: Number(params.productId)
			}
		});

		if (!oldProduct)
			return NextResponse.json({
				errors: [{ type: "productId", message: "Producto no encontrado" }],
				status: 404
			});

		const product = await prisma.product.delete({
			where: {
				id: Number(params.productId)
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCTS][ID][DELETE]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}
