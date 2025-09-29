import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice",
    },
  });
  console.log("Created:", user);

  // Read users
  const users = await prisma.user.findMany();
  console.log("All users:", users);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());