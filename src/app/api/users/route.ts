import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { hash } from "argon2";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
	try {
		const sizes = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				lastName: true,
				rol: true,
				createdAt: true,
				updatedAt: true
			}
		});

		return NextResponse.json(sizes);
	} catch (error) {
		console.log("[USERS][GET]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}

export async function POST(req: Request) {
	try {
		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });

		const body = await req.json();

		const user = await prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				rol: true
			}
		});

		if (!user)
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });

		if (user.rol !== "ADMIN") {
			return NextResponse.json({ errors: [{ type: "unauthorized", message: "Sin autorización" }], status: 401 });
		}

		const { email, lastName, name, rut, rol, password } = body;

		if (!name) return NextResponse.json({ errors: [{ type: "name", message: "Nombre requerido" }], status: 400 });
		if (!lastName)
			return NextResponse.json({ errors: [{ type: "lastName", message: "Apellido requerido" }], status: 400 });
		if (!email) return NextResponse.json({ errors: [{ type: "email", message: "Email requerido" }], status: 400 });
		if (!rut) return NextResponse.json({ errors: [{ type: "rut", message: "Rut requerido" }], status: 400 });
		if (!rol) return NextResponse.json({ errors: [{ type: "rol", message: "Rol requerido" }], status: 400 });
		if (!password)
			return NextResponse.json({ errors: [{ type: "password", message: "Contraseña requerida" }], status: 400 });

		const safePassword = await hash(password);

		const newUser = await prisma.user.create({
			data: {
				name,
				lastName,
				email,
				rut,
				rol,
				password: safePassword
			}
		});

		return NextResponse.json(newUser);
	} catch (error) {
		console.log("[USERS][POST]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}
