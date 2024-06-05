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
			return new NextResponse("ID del producto requerido", { status: 400 });
		}

		const product = await prisma.product.findFirst({
			where: {
				id: params.productId
			},
			include: {
				discounts: true,
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
		return new NextResponse("Error Interno", { status: 500 });
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
			return new NextResponse("ID del producto requerido", { status: 400 });
		}

		const userId = await getAuth(req);
		if (!userId) return new NextResponse("Sin autorización", { status: 401 });

		const body = await req.json();

		const { name, description, barcode, stock, sellPrice, costPrice, weightOrVolume, brandId, type, available } =
			body;

		if (!name) return new NextResponse("Nombre requerido", { status: 400 });
		if (!barcode) return new NextResponse("Barcode requerido", { status: 400 });
		if (!stock) return new NextResponse("Stock requerido", { status: 400 });
		if (!sellPrice) return new NextResponse("Precio de venta requerido", { status: 400 });
		if (!costPrice) return new NextResponse("Precio de costo requerido", { status: 400 });
		if (!weightOrVolume) return new NextResponse("Peso o Volumen requerido", { status: 400 });
		if (!brandId) return new NextResponse("Id de la Marca requerido", { status: 400 });
		if (!type) return new NextResponse("Tipo de producto requerido", { status: 400 });
		if (available === undefined) return new NextResponse("Disponibilidad requerido", { status: 400 });

		const oldProduct = await prisma.product.findFirst({
			where: {
				id: Number(params.productId)
			}
		});
		if (!oldProduct) return new NextResponse("No se encontró el producto", { status: 404 });

		const brand = await prisma.brand.findFirst({
			where: {
				id: brandId
			}
		});

		if (!brand) return new NextResponse("No se encontró la marca", { status: 404 });

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
				brandId,
				type,
				available,
				barcode
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCTS][ID][PATCH]", error);
		return new NextResponse("Error Interno", { status: 500 });
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
			return new NextResponse("ID del producto requerido", { status: 400 });
		}

		const userId = await getAuth(req);
		if (!userId) return new NextResponse("Sin autorización", { status: 401 });

		const isUserAdmin = await prisma.user.findFirst({
			where: {
				id: userId
			}
		});

		if (!isUserAdmin) return new NextResponse("Sin autorización", { status: 401 });

		const oldProduct = await prisma.product.findFirst({
			where: {
				id: Number(params.productId)
			}
		});

		if (!oldProduct) return new NextResponse("No se encontró el producto", { status: 404 });

		const product = await prisma.product.delete({
			where: {
				id: Number(params.productId)
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCTS][ID][DELETE]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}
