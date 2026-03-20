import { Router, Request, Response } from "express";
import prisma from "../config/prisma";

const router = Router();

// Get all pricing rules
router.get("/", async (_req: Request, res: Response) => {
  try {
    const rules = await prisma.pricingRule.findMany({
      include: { field: { select: { id: true, name: true } } },
      orderBy: [{ isWeekend: "asc" }, { startTime: "asc" }],
    });
    res.json(rules);
  } catch (error) {
    console.error("Get pricing error:", error);
    res.status(500).json({ error: "Failed to get pricing" });
  }
});

export default router;
