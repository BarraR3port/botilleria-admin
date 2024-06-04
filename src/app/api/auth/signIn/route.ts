import { jwtConfig } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { verify } from "argon2";
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

		const { email, password } = body;

		if (!email)
			return NextResponse.json({ errors: [{ type: "mail", message: "Email requerido" }] }, { status: 400 });
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
							type: "mail",
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

		const accessToken = await new SignJWT({ id: tempUser.id })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("1d")
			.sign(jwtConfig.secret);
		const refreshToken = await new SignJWT({ id: tempUser.id })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("1w")
			.sign(jwtConfig.refreshSecret);

		const user = await prisma.user.update({
			where: { id: tempUser.id },
			data: {
				lastLogin: new Date()
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

		const userResponse = {
			user,
			backendTokens: {
				accessToken: {
					token: accessToken,
					expireAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()
				},
				refreshToken: {
					token: refreshToken,
					expireAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7).getTime()
				}
			}
		};
		return NextResponse.json(userResponse);
	} catch (error) {
		console.log("[AUTH][SIGN IN][POST]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}
