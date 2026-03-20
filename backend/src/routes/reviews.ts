import { Router, Request, Response } from "express";
import prisma from "../config/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// Get all reviews
router.get("/", async (_req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ error: "Failed to get reviews" });
  }
});

// Create review
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
      return;
    }

    const review = await prisma.review.create({
      data: {
        userId: req.userId!,
        rating,
        comment,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
});

export default router;
