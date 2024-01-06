import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT" && req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const {
      id, // Assuming you receive the ID for the invoice to update
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

    // Use Prisma to update the invoice based on ID
    const updatedInvoice = await prisma.invoice.update({
      where: {
        id: id, // Use the received ID to locate the invoice to update
      },
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
      .status(200)
      .json({ message: "Invoice updated successfully", invoice: updatedInvoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ message: "Error updating invoice" });
  }
}
