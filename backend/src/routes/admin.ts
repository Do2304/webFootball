import { Router, Response } from "express";
import prisma from "../config/prisma";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// Dashboard stats
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

// Get all users
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

// Get all bookings
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

// Update booking status
router.patch("/bookings/:id/status", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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

// Delete user
router.delete("/users/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
