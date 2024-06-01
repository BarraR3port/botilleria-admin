import { PrismaClient } from "@prisma/client";

declare global {
	var prismaDB: PrismaClient | undefined;
}

const prisma = globalThis.prismaDB || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalThis.prismaDB = prisma;
}

export default prisma;
