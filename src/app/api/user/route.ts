import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
	try {
		const sizes = await prisma.user.findMany({});

		return NextResponse.json(sizes);
	} catch (error) {
		console.log("[SIZES][GET]", error);
		return new NextResponse("Error Interno", { status: 500 });
	}
}
