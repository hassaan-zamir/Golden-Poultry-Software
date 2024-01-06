import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name } = req.body;

    try {
      // Create the shed
      const newShed = await prisma.sheds.create({
        data: {
          name: name 
        }
      });

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
  
      const formattedSheds = sheds.map((shed) => ({
        id: shed.id,
        name: shed.name,
        houses: shed.house.map((h) => h.house_no)
      }));
  
      res.status(201).json({ sheds: formattedSheds });

    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
