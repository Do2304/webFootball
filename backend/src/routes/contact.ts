import { Router, Request, Response } from "express";
import prisma from "../config/prisma";

const router = Router();

// Submit contact form
router.post("/", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, message, howDidYouHear, agreedTerms } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
      res.status(400).json({ error: "All required fields must be filled" });
      return;
    }

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        message,
        howDidYouHear,
        agreedTerms: agreedTerms || false,
      },
    });

    res.status(201).json({ message: "Contact form submitted successfully", id: contact.id });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
});

export default router;
