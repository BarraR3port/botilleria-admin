import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const userId = await getAuth(req);
		if (!userId) return new NextResponse("Sin autorización", { status: 401 });

		const body = await req.json();

		const { name, description } = body;

		if (!name) return new NextResponse("Nombre requerido", { status: 400 });

		const brand = await prisma.brand.create({
			data: {
				name,
				description
			}
		});

		return NextResponse.json(brand);
	} catch (error) {
		console.log("[PRODUCTS][BRANDS][POST]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const brandId = searchParams.get("brandId") || undefined;

		const products = await prisma.brand.findMany({
			where: {
				id: brandId
			},
			orderBy: {
				createdAt: "desc"
			}
		});

		return NextResponse.json(products);
	} catch (error) {
		console.log("[PRODUCTS][BRANDS][GET]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}
