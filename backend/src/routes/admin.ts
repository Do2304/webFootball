import { Router, Response } from "express";
import prisma from "../config/prisma";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// ─── DASHBOARD STATS ────────────────────────────────────────
router.get("/stats", async (_req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, totalBookings, totalFields, totalRevenue, recentBookings] =
      await Promise.all([
        prisma.user.count(),
        prisma.booking.count(),
        prisma.field.count(),
        prisma.booking.aggregate({
          _sum: { totalPrice: true },
          where: { status: { not: "CANCELLED" } },
        }),
        prisma.booking.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, email: true } },
            field: { select: { name: true } },
          },
        }),
      ]);

    res.json({
      totalUsers,
      totalBookings,
      totalFields,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      recentBookings,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ─── USERS ──────────────────────────────────────────────────
router.get("/users", async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: { select: { bookings: true } },
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.delete("/users/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ─── BOOKINGS ───────────────────────────────────────────────
router.get("/bookings", async (_req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        field: { select: { name: true } },
      },
    });
    res.json(bookings);
  } catch (error) {
    console.error("Admin bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.patch("/bookings/:id/status", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const status = req.body.status as "PENDING" | "CONFIRMED" | "CANCELLED";
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { name: true, email: true } },
        field: { select: { name: true } },
      },
    });
    res.json(booking);
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

// ─── FIELDS MANAGEMENT ─────────────────────────────────────
router.get("/fields", async (_req: AuthRequest, res: Response) => {
  try {
    const fields = await prisma.field.findMany({
      orderBy: { name: "asc" },
      include: {
        pricingRules: true,
        _count: { select: { bookings: true } },
      },
    });
    res.json(fields);
  } catch (error) {
    console.error("Admin fields error:", error);
    res.status(500).json({ error: "Failed to fetch fields" });
  }
});

router.post("/fields", async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, type, imageUrl } = req.body;
    const field = await prisma.field.create({
      data: { name, description, type, imageUrl },
      include: { pricingRules: true },
    });
    res.status(201).json(field);
  } catch (error) {
    console.error("Create field error:", error);
    res.status(500).json({ error: "Failed to create field" });
  }
});

router.patch("/fields/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, type, imageUrl, isActive } = req.body;
    const field = await prisma.field.update({
      where: { id },
      data: { name, description, type, imageUrl, isActive },
      include: { pricingRules: true },
    });
    res.json(field);
  } catch (error) {
    console.error("Update field error:", error);
    res.status(500).json({ error: "Failed to update field" });
  }
});

router.delete("/fields/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.field.delete({ where: { id } });
    res.json({ message: "Field deleted" });
  } catch (error) {
    console.error("Delete field error:", error);
    res.status(500).json({ error: "Failed to delete field" });
  }
});

// Pricing rules for a field
router.post("/fields/:id/pricing", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { label, startTime, endTime, pricePerHour, isWeekend } = req.body;
    const rule = await prisma.pricingRule.create({
      data: { fieldId: id, label, startTime, endTime, pricePerHour, isWeekend },
    });
    res.status(201).json(rule);
  } catch (error) {
    console.error("Create pricing rule error:", error);
    res.status(500).json({ error: "Failed to create pricing rule" });
  }
});

router.delete("/pricing/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.pricingRule.delete({ where: { id } });
    res.json({ message: "Pricing rule deleted" });
  } catch (error) {
    console.error("Delete pricing rule error:", error);
    res.status(500).json({ error: "Failed to delete pricing rule" });
  }
});

// ─── PROMOTIONS ─────────────────────────────────────────────
router.get("/promotions", async (_req: AuthRequest, res: Response) => {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(promotions);
  } catch (error) {
    console.error("Admin promotions error:", error);
    res.status(500).json({ error: "Failed to fetch promotions" });
  }
});

router.post("/promotions", async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, code, discountPercent, discountAmount, startDate, endDate, isActive } = req.body;
    const promo = await prisma.promotion.create({
      data: { title, description, code, discountPercent, discountAmount, startDate: new Date(startDate as string), endDate: new Date(endDate as string), isActive },
    });
    res.status(201).json(promo);
  } catch (error) {
    console.error("Create promotion error:", error);
    res.status(500).json({ error: "Failed to create promotion" });
  }
});

router.patch("/promotions/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description, code, discountPercent, discountAmount, startDate, endDate, isActive } = req.body;
    const promo = await prisma.promotion.update({
      where: { id },
      data: {
        title, description, code, discountPercent, discountAmount,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        isActive,
      },
    });
    res.json(promo);
  } catch (error) {
    console.error("Update promotion error:", error);
    res.status(500).json({ error: "Failed to update promotion" });
  }
});

router.delete("/promotions/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.promotion.delete({ where: { id } });
    res.json({ message: "Promotion deleted" });
  } catch (error) {
    console.error("Delete promotion error:", error);
    res.status(500).json({ error: "Failed to delete promotion" });
  }
});

// ─── STAFF MANAGEMENT ───────────────────────────────────────
router.get("/staff", async (_req: AuthRequest, res: Response) => {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { name: "asc" },
    });
    res.json(staff);
  } catch (error) {
    console.error("Admin staff error:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

router.post("/staff", async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, role, salary, startDate } = req.body;
    const member = await prisma.staff.create({
      data: { name, email, phone, role, salary, startDate: new Date(startDate) },
    });
    res.status(201).json(member);
  } catch (error) {
    console.error("Create staff error:", error);
    res.status(500).json({ error: "Failed to create staff" });
  }
});

router.patch("/staff/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, email, phone, role, salary, isActive } = req.body;
    const member = await prisma.staff.update({
      where: { id },
      data: { name, email, phone, role, salary, isActive },
    });
    res.json(member);
  } catch (error) {
    console.error("Update staff error:", error);
    res.status(500).json({ error: "Failed to update staff" });
  }
});

router.delete("/staff/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.staff.delete({ where: { id } });
    res.json({ message: "Staff member deleted" });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({ error: "Failed to delete staff" });
  }
});

// ─── WAIVERS ────────────────────────────────────────────────
router.get("/waivers", async (_req: AuthRequest, res: Response) => {
  try {
    const waivers = await prisma.waiver.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(waivers);
  } catch (error) {
    console.error("Admin waivers error:", error);
    res.status(500).json({ error: "Failed to fetch waivers" });
  }
});

router.post("/waivers", async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, isRequired } = req.body;
    const waiver = await prisma.waiver.create({
      data: { title, content, isRequired },
    });
    res.status(201).json(waiver);
  } catch (error) {
    console.error("Create waiver error:", error);
    res.status(500).json({ error: "Failed to create waiver" });
  }
});

router.patch("/waivers/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, content, isRequired, isActive } = req.body;
    const waiver = await prisma.waiver.update({
      where: { id },
      data: { title, content, isRequired, isActive },
    });
    res.json(waiver);
  } catch (error) {
    console.error("Update waiver error:", error);
    res.status(500).json({ error: "Failed to update waiver" });
  }
});

router.delete("/waivers/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.waiver.delete({ where: { id } });
    res.json({ message: "Waiver deleted" });
  } catch (error) {
    console.error("Delete waiver error:", error);
    res.status(500).json({ error: "Failed to delete waiver" });
  }
});

// ─── NOTIFICATIONS ──────────────────────────────────────────
router.get("/notifications", async (_req: AuthRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  } catch (error) {
    console.error("Admin notifications error:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.post("/notifications", async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, type, targetAudience } = req.body;
    const notification = await prisma.notification.create({
      data: { title, message, type, targetAudience },
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

router.delete("/notifications/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.notification.delete({ where: { id } });
    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

// ─── SERVICES ───────────────────────────────────────────────
router.get("/services", async (_req: AuthRequest, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: "asc" },
    });
    res.json(services);
  } catch (error) {
    console.error("Admin services error:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

router.post("/services", async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, category } = req.body;
    const service = await prisma.service.create({
      data: { name, description, price, category },
    });
    res.status(201).json(service);
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ error: "Failed to create service" });
  }
});

router.patch("/services/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, price, category, isActive } = req.body;
    const service = await prisma.service.update({
      where: { id },
      data: { name, description, price, category, isActive },
    });
    res.json(service);
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ error: "Failed to update service" });
  }
});

router.delete("/services/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.service.delete({ where: { id } });
    res.json({ message: "Service deleted" });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

// ─── REPORTING ──────────────────────────────────────────────
router.get("/reports/revenue", async (req: AuthRequest, res: Response) => {
  try {
    const period = req.query.period as string || "daily";
    const now = new Date();
    let startDate: Date;

    if (period === "weekly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7 * 12);
    } else if (period === "monthly") {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    }

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: "CANCELLED" },
      },
      select: { totalPrice: true, createdAt: true, date: true },
      orderBy: { createdAt: "asc" },
    });

    // Group by date
    const grouped: Record<string, number> = {};
    for (const b of bookings) {
      const key = b.createdAt.toISOString().split("T")[0];
      grouped[key] = (grouped[key] || 0) + b.totalPrice;
    }

    const data = Object.entries(grouped).map(([date, revenue]) => ({ date, revenue }));

    // Summary stats
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalBookingsCount = bookings.length;

    res.json({ data, totalRevenue, totalBookings: totalBookingsCount });
  } catch (error) {
    console.error("Revenue report error:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

router.get("/reports/fields", async (_req: AuthRequest, res: Response) => {
  try {
    const fields = await prisma.field.findMany({
      include: {
        _count: { select: { bookings: true } },
        bookings: {
          where: { status: { not: "CANCELLED" } },
          select: { totalPrice: true },
        },
      },
    });

    const data = fields.map((f) => ({
      name: f.name,
      totalBookings: f._count.bookings,
      totalRevenue: f.bookings.reduce((sum, b) => sum + b.totalPrice, 0),
    }));

    res.json(data);
  } catch (error) {
    console.error("Field report error:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

export default router;
