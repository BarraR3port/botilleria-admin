import { jwtConfig } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { hash } from "argon2";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const { email, token, password, confirmPassword, recoveryId } = body;

		if (!email)
			return NextResponse.json({ errors: [{ type: "email", message: "Email requerido" }] }, { status: 400 });

		if (!token)
			return NextResponse.json({ errors: [{ type: "token", message: "Token requerido" }] }, { status: 400 });

		if (!password)
			return NextResponse.json(
				{ errors: [{ type: "password", message: "Contraseña requerida" }] },
				{ status: 400 }
			);

		if (!confirmPassword)
			return NextResponse.json(
				{ errors: [{ type: "confirmPassword", message: "Confirmar contraseña requerida" }] },
				{ status: 400 }
			);

		if (password !== confirmPassword)
			return NextResponse.json(
				{ errors: [{ type: "confirmPassword", message: "Las contraseñas no coinciden" }] },
				{ status: 400 }
			);

		const recovery = await prisma.recovery.findUnique({
			where: {
				id: recoveryId,
				token
			}
		});

		if (!recovery) {
			return NextResponse.json(
				{
					errors: [
						{
							type: "token",
							message: "Token inválido"
						}
					]
				},
				{ status: 400 }
			);
		}

		if (recovery.status !== "WAITING") {
			return NextResponse.json(
				{
					errors: [
						{
							type: "token",
							message: "Token inválido"
						}
					]
				},
				{ status: 400 }
			);
		}

		const decoded = await jwtVerify(recovery.token, jwtConfig.reset);

		if (decoded.payload?.email !== email) {
			return NextResponse.json(
				{
					errors: [
						{
							type: "email",
							message: "Email inválido"
						}
					]
				},
				{ status: 400 }
			);
		}

		const safePassword = await hash(password);

		const user = await prisma.user.update({
			where: {
				email
			},
			data: {
				password: safePassword
			}
		});

		await prisma.recovery.update({
			where: {
				id: recoveryId
			},
			data: {
				status: "USED"
			}
		});

		if (!user) {
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

		return new NextResponse("Correo de recuperación enviado", { status: 200 });
	} catch (error) {
		console.log("[AUTH][SIGN IN][POST]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}
