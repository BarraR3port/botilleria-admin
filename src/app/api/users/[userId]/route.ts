import { getAuth } from "@/auth/utils";
import prisma from "@/lib/prismadb";
import { hash } from "argon2";
import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	{
		params
	}: {
		params: {
			userId: string;
		};
	}
) {
	try {
		if (!params.userId) {
			return NextResponse.json(
				{
					errors: [{ type: "userId", message: "ID del usuario requerido" }]
				},
				{ status: 400 }
			);
		}

		const user = await prisma.user.findFirst({
			where: {
				id: params.userId
			},
			select: {
				id: true,
				name: true,
				lastName: true,
				rut: true,
				createdAt: true,
				rol: true
			}
		});

		return NextResponse.json(user);
	} catch (error) {
		console.log("[USERS][ID][GET]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}

export async function PATCH(
	req: Request,
	{
		params
	}: {
		params: {
			userId: string;
		};
	}
) {
	try {
		if (!params.userId) {
			return NextResponse.json(
				{
					errors: [{ type: "userId", message: "ID del usuario requerido" }]
				},
				{ status: 400 }
			);
		}

		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);

		const body = await req.json();
		const { type } = body;

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
			return NextResponse.json(
				{ errors: [{ type: "unauthorized", message: "Sin autorización" }] },
				{ status: 401 }
			);
		}

		if (type === "password") {
			const { password, confirmPassword } = body;

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

			const safePassword = await hash(password);

			const newUser = await prisma.user.update({
				where: {
					id: params.userId
				},
				data: {
					password: safePassword
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

			return NextResponse.json(newUser);
		}

		const { email, lastName, name, rut, rol } = body;

		if (!name)
			return NextResponse.json({ errors: [{ type: "name", message: "Nombre requerido" }] }, { status: 400 });
		if (!lastName)
			return NextResponse.json(
				{ errors: [{ type: "lastName", message: "Apellido requerido" }] },
				{ status: 400 }
			);
		if (!email)
			return NextResponse.json({ errors: [{ type: "email", message: "Email requerido" }] }, { status: 400 });
		if (!rut) return NextResponse.json({ errors: [{ type: "rut", message: "Rut requerido" }] }, { status: 400 });
		if (!rol) return NextResponse.json({ errors: [{ type: "rol", message: "Rol requerido" }] }, { status: 400 });

		const newUser = await prisma.user.update({
			where: {
				id: params.userId
			},
			data: {
				name,
				lastName,
				email,
				rut,
				rol
			}
		});

		return NextResponse.json(newUser);
	} catch (error) {
		console.log("[USERS][ID][PATCH]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}

export async function DELETE(
	req: Request,
	{
		params
	}: {
		params: {
			productId: number;
		};
	}
) {
	try {
		if (!params.productId) {
			return NextResponse.json(
				{
					errors: [{ type: "productId", message: "ID del producto requerido" }]
				},
				{ status: 400 }
			);
		}

		const userId = await getAuth(req);
		if (!userId)
			return NextResponse.json({ errors: [{ type: "auth", message: "Sin autorización" }] }, { status: 401 });

		const isUserAdmin = await prisma.user.findUnique({
			where: {
				id: userId,
				rol: "ADMIN"
			}
		});

		if (!isUserAdmin)
			return NextResponse.json({ errors: [{ type: "auth", message: "Sin autorización" }] }, { status: 401 });

		const oldProduct = await prisma.product.findFirst({
			where: {
				id: Number(params.productId)
			}
		});

		if (!oldProduct)
			return NextResponse.json({
				errors: [{ type: "productId", message: "Producto no encontrado" }],
				status: 404
			});

		const product = await prisma.product.delete({
			where: {
				id: Number(params.productId)
			}
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[USERS][ID]][DELETE]", error);
		return NextResponse.json({
			errors: [{ type: "internal", message: "Ocurrió un error interno, por favor contactar soporte" }],
			status: 500
		});
	}
}
