import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sheds = await prisma.sheds.findMany({
      select: {
        id: true,
        name: true,
        house: {
          select: {
            house_no: true
          }
        }
      }
    });

    const invoices = await prisma.invoice.findMany({
      orderBy: {
        id: "desc"
      }
    });

    const brokers = await prisma.brokers.findMany();

    const formattedSheds = sheds.map((shed) => ({
      id: shed.id,
      name: shed.name,
      houses: shed.house.map((h) => h.house_no)
    }));

    res.status(200).json({ sheds: formattedSheds, invoices, brokers });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
