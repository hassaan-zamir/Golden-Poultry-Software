import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { house_no, shed_no } = req.body;

    try {
      const shed = await prisma.sheds.findFirst({
        where: {
          name: shed_no
        }
      });

      if (!shed) {
        return res.status(404).json({ error: "Shed not found" });
      }


      const newHouse = await prisma.house.create({
        data: {
          house_no: house_no, 
          sheds: {
            connect: {
              id: shed.id 
            }
          }
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
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
