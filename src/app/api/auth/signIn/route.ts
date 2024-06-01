import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

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

		const { email, password } = body;

		if (!email) return new NextResponse("Email requerido", { status: 400 });
		if (!password) return new NextResponse("Password requerida", { status: 400 });

		const { email, password } = loginDto;
		const user = await this.prisma.user.findFirst({
			where: {
				email
			},
			select: {
				password: true,
				id: true,
				assignedGoogleID: true
			}
		});

		if (!user) {
			return {
				errors: [
					{
						type: "mail",
						message: "Este email no está registrado"
					}
				]
			};
		}

		if (user.password.length === 0 && user.assignedGoogleID.length > 0) {
			return {
				errors: [
					{
						type: "mail",
						message: "Este email ya está registrado con Google."
					}
				]
			};
		}

		const safePassword = await verify(user.password, password);

		if (!safePassword) {
			return {
				errors: [
					{
						type: "password",
						message: "Contraseña incorrecta"
					}
				]
			};
		}

		const accessToken = sign({ id: user.id }, JWT_SECRET, { expiresIn: "12h" });
		const refreshToken = sign({ id: user.id }, JWT_REFRESH_SECRET, {
			expiresIn: "1w"
		});

		const newUser = await this.prisma.user.update({
			where: { id: user.id },
			data: {
				lastLogin: new Date(),
				signedIn: true
			},
			select: this.utils.getSafePersonalUserFields()
		});

		const userResponse = {
			user: newUser,
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
		console.log("[SIZES][POST]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}
