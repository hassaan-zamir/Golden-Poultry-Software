import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id } = req.body;

    // Use Prisma to delete the invoice based on ID
    await prisma.invoice.delete({
      where: {
        id: id, // Use the received ID to locate the invoice to delete
      },
    });

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ message: "Error deleting invoice" });
  }
}
