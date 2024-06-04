import { auth, getAuth } from "@/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const userId = getAuth(req);
		if (!userId) return new NextResponse("Sin autorización", { status: 401 });

		const body = await req.json();

		const { name, description, stock, sellPrice, costPrice, weightOrVolume, brandId, type, available } = body;

		if (!name) return new NextResponse("Nombre requerido", { status: 400 });
		if (!description) return new NextResponse("Descripción requerida", { status: 400 });
		if (!stock) return new NextResponse("Stock requerido", { status: 400 });
		if (!sellPrice) return new NextResponse("Precio de venta requerido", { status: 400 });
		if (!costPrice) return new NextResponse("Precio de costo requerido", { status: 400 });
		if (!weightOrVolume) return new NextResponse("Peso o Volumen requerido", { status: 400 });
		if (!brandId) return new NextResponse("Id de la Marca requerido", { status: 400 });
		if (!type) return new NextResponse("Tipo de producto requerido", { status: 400 });
		if (available === undefined) return new NextResponse("Disponibilidad requerido", { status: 400 });

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
		return new NextResponse("Error Interno", { status: 500 });
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
		return new NextResponse("Error Interno", { status: 500 });
	}
}
