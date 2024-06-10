import { refreshSession } from "@/auth/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const authHeader = req.headers.get("authorization");

		if (!authHeader) {
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });
		}
		const token = authHeader?.split(" ")[1];
		if (!token) {
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });
		}

		const session = await refreshSession(token);

		if (!session) {
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });
		}

		return NextResponse.json(session);
	} catch (error) {
		console.log("[PRODUCTS][BRANDS][POST]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}
