import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

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
