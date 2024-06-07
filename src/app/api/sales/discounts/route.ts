import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });

		const body = await req.json();

		const { name, description, type, active, value } = body;

		if (!name) return NextResponse.json({ errors: [{ type: "name", message: "Nombre requerido" }], status: 400 });

		if (!type) return NextResponse.json({ errors: [{ type: "type", message: "Tipo requerido" }], status: 400 });

		if (active === undefined)
			return NextResponse.json({ errors: [{ type: "active", message: "Activo requerido" }], status: 400 });

		if (!value) return NextResponse.json({ errors: [{ type: "value", message: "Valor requerido" }], status: 400 });

		const discount = await prisma.discount.create({
			data: {
				name,
				description,
				type,
				active,
				value
			}
		});

		return NextResponse.json(discount);
	} catch (error) {
		console.log("[SALES][DISCOUNT][POST]", error);
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

		const sales = await prisma.discount.findMany({
			orderBy: {
				createdAt: "desc"
			}
		});

		return NextResponse.json(sales);
	} catch (error) {
		console.log("[SALES][DISCOUNT][GET]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}
