import { getAuth } from "@/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	{
		params
	}: {
		params: {
			brandId: string;
		};
	}
) {
	try {
		if (!params.brandId) {
			return new NextResponse("ID de la marca requerida", { status: 400 });
		}

		const product = await prisma.brand.findFirst({
			where: {
				id: params.brandId
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCT][BRANDS][ID][GET]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{
		params
	}: {
		params: {
			brandId: string;
		};
	}
) {
	try {
		if (!params.brandId) {
			return new NextResponse("ID de la marca requerida", { status: 400 });
		}

		const userId = getAuth(req);
		if (!userId) return new NextResponse("Sin autorización", { status: 401 });

		const body = await req.json();

		const { name, description } = body;

		if (!name) return new NextResponse("Nombre requerido", { status: 400 });
		if (!description) return new NextResponse("Descripción requerida", { status: 400 });

		const brand = await prisma.brand.findFirst({
			where: {
				id: params.brandId
			}
		});

		if (!brand) return new NextResponse("No se encontró la marca", { status: 404 });

		const product = await prisma.brand.update({
			where: {
				id: params.brandId
			},
			data: {
				name,
				description
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCT][BRANDS][ID][PATCH]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{
		params
	}: {
		params: {
			brandId: string;
		};
	}
) {
	try {
		if (!params.brandId) {
			return new NextResponse("ID de la marca requerida", { status: 400 });
		}

		const userId = getAuth(req);

		if (!userId) return new NextResponse("Sin autorización", { status: 401 });

		const isUserAdmin = await prisma.user.findFirst({
			where: {
				id: userId,
				rol: "ADMIN"
			}
		});

		if (!isUserAdmin) return new NextResponse("Sin autorización", { status: 401 });

		const oldBrand = await prisma.brand.findFirst({
			where: {
				id: params.brandId
			}
		});

		if (!oldBrand) return new NextResponse("No se encontró la marca", { status: 404 });

		const brand = await prisma.brand.delete({
			where: {
				id: params.brandId
			}
		});

		return NextResponse.json(brand);
	} catch (error) {
		console.log("[PRODUCT][BRANDS][ID][DELETE]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}
