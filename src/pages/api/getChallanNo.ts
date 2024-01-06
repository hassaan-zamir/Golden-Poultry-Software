import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { id: "desc" }, // Order by ID in descending order to get the latest entry
    });

    let nextId = 1; // Default value if no rows exist

    if (lastInvoice) {
      nextId = lastInvoice.id + 1; // Increment ID by 1 if a row exists
    }

    res.status(200).json({ challanNo: nextId });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
}
