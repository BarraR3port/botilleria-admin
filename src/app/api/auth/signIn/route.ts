import { authorizeUser, jwtConfig } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { verify } from "argon2";
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
		console.log("[SIZES][GET]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const { email, password } = body;

		if (!email)
			return NextResponse.json({ errors: [{ type: "email", message: "Email requerido" }] }, { status: 400 });
		if (!password)
			return NextResponse.json(
				{ errors: [{ type: "password", message: "Contraseña requerida" }] },
				{ status: 400 }
			);

		const tempUser = await prisma.user.findFirst({
			where: {
				email
			},
			select: {
				password: true,
				id: true
			}
		});

		if (!tempUser) {
			return NextResponse.json(
				{
					errors: [
						{
							type: "email",
							message: "Este email no está registrado"
						}
					]
				},
				{ status: 400 }
			);
		}

		const safePassword = await verify(tempUser.password, password);

		if (!safePassword) {
			return NextResponse.json(
				{
					errors: [
						{
							type: "password",
							message: "Contraseña incorrecta"
						}
					]
				},
				{ status: 400 }
			);
		}

		const userResponse = await authorizeUser(tempUser.id);

		return NextResponse.json(userResponse);
	} catch (error) {
		console.log("[AUTH][SIGN IN][POST]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}
