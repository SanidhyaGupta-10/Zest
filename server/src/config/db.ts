import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function connectDB() {
    prisma.$connect()
        .then(() => console.log("DB connected ✅"))
        .catch((err: any) => console.error(err));
}
