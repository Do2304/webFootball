import { Router, Response } from "express";
import prisma from "../config/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// Create booking
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { fieldId, date, startTime, endTime, playerName, playerPhone, playerEmail, notes } = req.body;

    // Check if slot is available
    const targetDate = new Date(date);
    const existing = await prisma.booking.findFirst({
      where: {
        fieldId,
        date: targetDate,
        startTime,
        status: { not: "CANCELLED" },
      },
    });

    if (existing) {
      res.status(409).json({ error: "This time slot is already booked" });
      return;
    }

    // Calculate price
    const isWeekend = [0, 6].includes(targetDate.getDay());
    const hour = parseInt(startTime.split(":")[0]);
    const rule = await prisma.pricingRule.findFirst({
      where: {
        fieldId,
        isWeekend,
        startTime: { lte: startTime },
        endTime: { gt: startTime },
      },
    });

    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);
    const hours = endHour - startHour;
    const totalPrice = (rule?.pricePerHour || 0) * hours;

    const booking = await prisma.booking.create({
      data: {
        userId: req.userId!,
        fieldId,
        date: targetDate,
        startTime,
        endTime,
        totalPrice,
        playerName,
        playerPhone,
        playerEmail,
        notes,
      },
      include: {
        field: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Get user's bookings
router.get("/my", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.userId },
      include: { field: true },
      orderBy: { date: "desc" },
    });
    res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Failed to get bookings" });
  }
});

// Cancel booking
router.patch("/:id/cancel", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    });

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    if (booking.userId !== req.userId) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: "CANCELLED" },
      include: { field: true },
    });

    res.json(updated);
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

// Get all bookings (admin)
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        field: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { date: "desc" },
    });
    res.json(bookings);
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({ error: "Failed to get bookings" });
  }
});

export default router;
