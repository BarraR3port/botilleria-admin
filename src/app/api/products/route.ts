import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });

		const body = await req.json();

		const { name, description, barcode, stock, sellPrice, costPrice, weightOrVolume, brandId, type, available } =
			body;

		if (!name)
			return NextResponse.json({ errors: [{ type: "name", message: "Nombre requerido" }] }, { status: 400 });
		if (!barcode)
			return NextResponse.json(
				{ errors: [{ type: "barcode", message: "Código de barras requerido" }] },
				{ status: 400 }
			);
		if (!stock)
			return NextResponse.json({ errors: [{ type: "stock", message: "Stock requerido" }] }, { status: 400 });
		if (!sellPrice)
			return NextResponse.json(
				{ errors: [{ type: "sellPrice", message: "Precio de venta requerido" }] },
				{ status: 400 }
			);
		if (!costPrice)
			return NextResponse.json(
				{ errors: [{ type: "costPrice", message: "Precio de costo requerido" }] },
				{ status: 400 }
			);
		if (!weightOrVolume)
			return NextResponse.json(
				{ errors: [{ type: "weightOrVolume", message: "Peso o volumen requerido" }] },
				{ status: 400 }
			);
		if (!brandId)
			return NextResponse.json({ errors: [{ type: "brandId", message: "Marca requerida" }] }, { status: 400 });
		if (!type) return NextResponse.json({ errors: [{ type: "type", message: "Tipo requerido" }] }, { status: 400 });
		if (available === undefined)
			return NextResponse.json(
				{ errors: [{ type: "available", message: "Disponibilidad requerida" }] },
				{ status: 400 }
			);

		const store = await prisma.product.create({
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
				brand: { connect: { id: brandId } },
				user: {
					connect: {
						id: userId
					}
				}
			}
		});

		return NextResponse.json(store);
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
		const { searchParams } = new URL(req.url);
		const brandId = searchParams.get("brandId") || undefined;

		const products = await prisma.product.findMany({
			where: {
				brandId: brandId,
				available: true
			},
			include: {
				brand: true
			},
			orderBy: {
				createdAt: "desc"
			}
		});

		return NextResponse.json(products);
	} catch (error) {
		console.log("[PRODUCTS][GET]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}
