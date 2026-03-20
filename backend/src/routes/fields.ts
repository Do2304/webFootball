import { Router, Request, Response } from "express";
import prisma from "../config/prisma";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// Get all fields
router.get("/", async (_req: Request, res: Response) => {
  try {
    const fields = await prisma.field.findMany({
      where: { isActive: true },
      include: { pricingRules: true },
      orderBy: { name: "asc" },
    });
    res.json(fields);
  } catch (error) {
    console.error("Get fields error:", error);
    res.status(500).json({ error: "Failed to get fields" });
  }
});

// Get field by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const field = await prisma.field.findUnique({
      where: { id: req.params.id },
      include: { pricingRules: true },
    });

    if (!field) {
      res.status(404).json({ error: "Field not found" });
      return;
    }

    res.json(field);
  } catch (error) {
    console.error("Get field error:", error);
    res.status(500).json({ error: "Failed to get field" });
  }
});

// Create field (admin only)
router.post(
  "/",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, description, type, imageUrl } = req.body;
      const field = await prisma.field.create({
        data: { name, description, type, imageUrl },
      });
      res.status(201).json(field);
    } catch (error) {
      console.error("Create field error:", error);
      res.status(500).json({ error: "Failed to create field" });
    }
  }
);

// Get field availability for a specific date
router.get("/:id/availability", async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    if (!date) {
      res.status(400).json({ error: "Date is required" });
      return;
    }

    const targetDate = new Date(date as string);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        fieldId: req.params.id,
        date: { gte: startOfDay, lte: endOfDay },
        status: { not: "CANCELLED" },
      },
      select: { startTime: true, endTime: true, status: true },
    });

    const field = await prisma.field.findUnique({
      where: { id: req.params.id },
      include: { pricingRules: true },
    });

    if (!field) {
      res.status(404).json({ error: "Field not found" });
      return;
    }

    // Generate time slots from 6:00 to 23:00
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      const timeStr = `${hour.toString().padStart(2, "0")}:00`;
      const isBooked = bookings.some((b) => b.startTime === timeStr);

      // Find applicable pricing rule
      const isWeekend = [0, 6].includes(targetDate.getDay());
      const rule = field.pricingRules.find((r) => {
        const rStart = parseInt(r.startTime.split(":")[0]);
        const rEnd = parseInt(r.endTime.split(":")[0]);
        return hour >= rStart && hour < rEnd && r.isWeekend === isWeekend;
      });

      slots.push({
        time: timeStr,
        available: !isBooked,
        price: rule?.pricePerHour || 0,
      });
    }

    res.json({ field: field.name, date: date, slots });
  } catch (error) {
    console.error("Get availability error:", error);
    res.status(500).json({ error: "Failed to get availability" });
  }
});

export default router;
