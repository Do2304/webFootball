import { Router, Request, Response } from "express";
import prisma from "../config/prisma";

const router = Router();

// Get all gallery images
router.get("/", async (_req: Request, res: Response) => {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: "asc" },
    });
    res.json(images);
  } catch (error) {
    console.error("Get gallery error:", error);
    res.status(500).json({ error: "Failed to get gallery images" });
  }
});

export default router;
