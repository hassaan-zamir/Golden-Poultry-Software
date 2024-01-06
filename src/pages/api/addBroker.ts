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
      const newBroker = await prisma.brokers.create({
        data: {
          name: name 
        }
      });

      const brokers = await prisma.brokers.findMany();
  
     
  
      res.status(201).json({ brokers });

    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
