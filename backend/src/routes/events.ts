import { Router, Request, Response } from "express";
import prisma from "../config/prisma";

const router = Router();

// Get upcoming events
router.get("/", async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
    });
    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ error: "Failed to get events" });
  }
});

export default router;
