import { authorizeUser, jwtConfig } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { hash, verify } from "argon2";
import { SignJWT } from "jose";
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

		const { email, password, firstName, lastName } = body;

		if (!email) {
			return NextResponse.json({ errors: [{ type: "email", message: "Email requerido" }] }, { status: 400 });
		}

		if (!password) {
			return NextResponse.json(
				{ errors: [{ type: "password", message: "Contraseña requerida" }] },
				{ status: 400 }
			);
		}

		if (!firstName) {
			return NextResponse.json({ errors: [{ type: "firstName", message: "Nombre requerido" }] }, { status: 400 });
		}

		if (!lastName) {
			return NextResponse.json(
				{ errors: [{ type: "lastName", message: "Apellido requerido" }] },
				{ status: 400 }
			);
		}

		const tempUser = await prisma.user.findFirst({
			where: {
				email
			},
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

		if (tempUser) {
			return NextResponse.json(
				{
					errors: [
						{
							type: "email",
							message: "Este email ya está registrado"
						}
					]
				},
				{ status: 400 }
			);
		}

		const safePassword = await hash(password);

		const user = await prisma.user.create({
			data: {
				name: firstName ?? "",
				email,
				password: safePassword,
				lastName: lastName ?? ""
			},
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

		const userResponse = authorizeUser(user.id);

		return NextResponse.json(userResponse);
	} catch (error) {
		console.log("[AUTH][SIGN UP][POST]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}
