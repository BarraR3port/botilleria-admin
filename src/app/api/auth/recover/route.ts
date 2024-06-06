import { generatePassword, jwtConfig } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const { email } = body;

		if (!email)
			return NextResponse.json({ errors: [{ type: "email", message: "Email requerido" }] }, { status: 400 });

		const user = await prisma.user.findFirst({
			where: {
				email
			},
			select: {
				id: true,
				emailRecoveries: true
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
		const recovery = user.emailRecoveries.filter(email => email.status === "WAITING");

		if (recovery.length > 0) {
			const lastRecovery = recovery[user.emailRecoveries.length - 1];
			const now = new Date();
			const diff = now.getTime() - lastRecovery.createdAt.getTime();
			if (diff < 1000 * 60 * 5) {
				return NextResponse.json(
					{
						errors: [
							{
								type: "email",
								message: "Ya se ha enviado un correo de recuperación, espera unos minutos"
							}
						]
					},
					{ status: 400 }
				);
			}
		}

		const token = await new SignJWT({ email })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("1d")
			.sign(jwtConfig.reset);

		const { error } = await resend.emails.send({
			from: "Botillería <noreply@parystudio.com>",
			to: [email],
			subject: "Restauración de Contraseña",
			html: `	<body style="background-color: #121212; font-family: Arial, sans-serif; color: rgba(255, 255, 255, 0.85); text-align: center; padding: 50px;">
					   <div style="max-width: 600px; margin: auto; background-color: #1e1e1e; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
					       <h2>Vemos que necesitas ayuda para acceder a tu cuenta.</h2>
					       <div style="background-color: #272727; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0px 0px 5px rgba(0,0,0,0.1);">
					           <h3>Tu link de verificación</h3>
					           <p style="color: rgba(255, 255, 255, 0.65);">Por favor, utiliza el siguiente código para restaurar tu contraseña. Si no la solicitaste, puedes ignorar este correo de manera segura.</p>
					           <a 
					               href="${process.env.NEXT_PUBLIC_API_URL}/resetpassword?token=${token}" 
					               style="color: rgba(37, 109, 241, 0.65); font-family: monospace; text-decoration: none; display: inline-block; margin-top: 10px;"
					               onmouseover="this.style.color='rgba(37, 109, 241, 1)'; this.style.textDecoration='underline';"
					               onmouseout="this.style.color='rgba(37, 109, 241, 0.65)'; this.style.textDecoration='none';"
					           >
					              Restaurar Contraseña
					           </a>
					       </div>
					   </div>
					</body>`
		});

		if (error) {
			console.log("[AUTH][RECOVER][POST]", error);
			return new NextResponse("Error al intentar enviar el correo electrónico", { status: 500 });
		}

		let ipAddress = req.headers.get("x-real-ip");

		const forwardedFor = req.headers.get("x-forwarded-for") as string;
		if (!ipAddress && forwardedFor) {
			ipAddress = forwardedFor?.split(",").at(0) ?? "Unknown";
		}

		await prisma.recovery.create({
			data: {
				token,
				ip: ipAddress ?? "Unknown IP",
				user: {
					connect: {
						id: user.id
					}
				}
			}
		});

		return new NextResponse("Correo de recuperación enviado", { status: 200 });
	} catch (error) {
		console.log("[AUTH][SIGN IN][POST]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}
