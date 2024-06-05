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
		return new NextResponse("Error Interno", { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const userId = await getAuth(req);
		if (!userId) return new NextResponse("Sin autorización", { status: 401 });

		const body = await req.json();

		const user = await prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				rol: true
			}
		});

		if (!user) return new NextResponse("Usuario no encontrado", { status: 404 });

		if (user.rol !== "ADMIN") {
			return new NextResponse("Sin autorización", { status: 401 });
		}

		const { email, lastName, name, rut, rol, password } = body;

		if (!name) return new NextResponse("Nombre requerido", { status: 400 });
		if (!lastName) return new NextResponse("Apellido requerido", { status: 400 });
		if (!email) return new NextResponse("Email requerido", { status: 400 });
		if (!rut) return new NextResponse("Rut requerido", { status: 400 });
		if (!rol) return new NextResponse("Rol requerido", { status: 400 });
		if (!password) return new NextResponse("Contraseña requerida", { status: 400 });

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
		return new NextResponse("Error Interno", { status: 500 });
	}
}
