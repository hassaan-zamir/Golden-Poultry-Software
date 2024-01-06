
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
    const {
      vehicle_no,
      date,
      shed,
      house_no,
      broker_name,
      driver_name,
      first_weight,
      second_weight,
      todays_rate,
      add_less,
      cash,
      online,
      commission,
      paid,
    } = req.body;

    // Use Prisma to create a new invoice
    const newInvoice = await prisma.invoice.create({
      data: {
        vehicle_no,
        date,
        shed,
        house_no,
        broker_name,
        driver_name,
        first_weight,
        second_weight,
        todays_rate,
        add_less,
        cash,
        online,
        commission,
        paid,
      },
    });

    res
      .status(201)
      .json({ message: "Invoice added successfully", invoice: newInvoice });
  } catch (error) {
    console.error("Error adding invoice:", error);
    res.status(500).json({ message: "Error adding invoice" });
  }
}
