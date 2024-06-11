import { getAuth } from "@/auth/utils";
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
			return NextResponse.json(
				{
					errors: [{ type: "brandId", message: "ID de la marca requerida" }]
				},
				{ status: 400 }
			);
		}

		const product = await prisma.brand.findFirst({
			where: {
				id: params.brandId
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCTS][BRANDS][ID][GET]", error);
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
			brandId: string;
		};
	}
) {
	try {
		if (!params.brandId) {
			return NextResponse.json(
				{ errors: [{ type: "brandId", message: "ID de la marca requerida" }] },
				{ status: 400 }
			);
		}

		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);

		const body = await req.json();

		const { name, description } = body;

		if (!name) return NextResponse.json({ errors: [{ type: "name", message: "Nombre requerido" }], status: 400 });

		const brand = await prisma.brand.findFirst({
			where: {
				id: params.brandId
			}
		});

		if (!brand)
			return NextResponse.json({ errors: [{ type: "brand", message: "Marca no encontrada" }], status: 404 });

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
		console.log("[PRODUCTS][BRANDS][ID][PATCH]", error);
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
			brandId: string;
		};
	}
) {
	try {
		if (!params.brandId) {
			return NextResponse.json(
				{
					errors: [{ type: "brandId", message: "ID de la marca requerida" }]
				},
				{ status: 400 }
			);
		}

		const userId = await getAuth(req);

		if (!userId)
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);

		const isUserAdmin = await prisma.user.findUnique({
			where: {
				id: userId,
				rol: "ADMIN"
			}
		});

		if (!isUserAdmin)
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);

		const oldBrand = await prisma.brand.findFirst({
			where: {
				id: params.brandId
			}
		});

		if (!oldBrand)
			return NextResponse.json({ errors: [{ type: "brand", message: "Marca no encontrada" }], status: 404 });

		const brand = await prisma.brand.delete({
			where: {
				id: params.brandId
			}
		});

		return NextResponse.json(brand);
	} catch (error) {
		console.log("[PRODUCTS][BRANDS][ID][DELETE]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}
