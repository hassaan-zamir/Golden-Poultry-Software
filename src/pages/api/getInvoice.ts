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

    console.log('id', id)
    // Fetch the invoice based on the received ID
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: Number(id), // Assuming the ID is passed as a number
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice fetched successfully", invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ message: "Error fetching invoice" });
  }
}
