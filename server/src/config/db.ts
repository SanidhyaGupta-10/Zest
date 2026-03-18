import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()

export async function connectDB() {
    prisma.$connect()
        .then(() => console.log("DB connected ✅"))
        .catch((err: any) => console.error(err));
}
