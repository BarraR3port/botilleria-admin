import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { hash, verify } from "argon2";
import { sign } from "jsonwebtoken";

const { JWT_REFRESH_SECRET, JWT_SECRET } = process.env;

export async function GET(_req: Request) {
	try {
		const sizes = await prisma.user.findMany({});

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
			return NextResponse.json({ errors: [{ type: "mail", message: "Email requerido" }] }, { status: 400 });
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
			}
		});

		if (tempUser) {
			return NextResponse.json(
				{
					errors: [
						{
							type: "mail",
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
			}
		});

		if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
			return new NextResponse("Error Interno", { status: 500 });
		}

		const accessToken = sign({ id: user.id }, JWT_SECRET, { expiresIn: "12h" });
		const refreshToken = sign({ id: user.id }, JWT_REFRESH_SECRET, {
			expiresIn: "1w"
		});

		const userResponse = {
			user,
			backendTokens: {
				accessToken: {
					token: accessToken,
					expireAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 12).getTime()
				},
				refreshToken: {
					token: refreshToken,
					expireAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7).getTime()
				}
			}
		};
		return NextResponse.json(userResponse);
	} catch (error) {
		console.log("[AUTH][SIGN UP][POST]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}
