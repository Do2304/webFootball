import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Create fields
  const fields = await Promise.all([
    prisma.field.create({
      data: {
        name: "Field #1",
        description: "Premium artificial turf field with LED lighting",
        type: "7v7",
        imageUrl: "/images/field1.jpg",
      },
    }),
    prisma.field.create({
      data: {
        name: "Field #2",
        description: "Standard artificial turf field",
        type: "7v7",
        imageUrl: "/images/field2.jpg",
      },
    }),
    prisma.field.create({
      data: {
        name: "Field #3",
        description: "Indoor turf field with climate control",
        type: "7v7",
        imageUrl: "/images/field3.jpg",
      },
    }),
    prisma.field.create({
      data: {
        name: "Field #4",
        description: "Outdoor field with panoramic view",
        type: "7v7",
        imageUrl: "/images/field4.jpg",
      },
    }),
  ]);

  // Create pricing rules for each field
  for (const field of fields) {
    await prisma.pricingRule.createMany({
      data: [
        {
          fieldId: field.id,
          label: "Weekday Morning",
          startTime: "06:00",
          endTime: "16:00",
          pricePerHour: 40,
          isWeekend: false,
        },
        {
          fieldId: field.id,
          label: "Weekday Peak",
          startTime: "16:00",
          endTime: "23:00",
          pricePerHour: 70,
          isWeekend: false,
        },
        {
          fieldId: field.id,
          label: "Weekend Morning",
          startTime: "06:00",
          endTime: "16:00",
          pricePerHour: 60,
          isWeekend: true,
        },
        {
          fieldId: field.id,
          label: "Weekend Peak",
          startTime: "16:00",
          endTime: "23:00",
          pricePerHour: 80,
          isWeekend: true,
        },
      ],
    });
  }

  // Create sample reviews
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@football.com",
      name: "Admin",
      role: "ADMIN",
    },
  });

  const sampleUsers = await Promise.all([
    prisma.user.create({
      data: { email: "john@example.com", name: "John Doe" },
    }),
    prisma.user.create({
      data: { email: "jane@example.com", name: "Jane Smith" },
    }),
    prisma.user.create({
      data: { email: "mike@example.com", name: "Mike Johnson" },
    }),
  ]);

  await prisma.review.createMany({
    data: [
      {
        userId: sampleUsers[0].id,
        rating: 5,
        comment: "Great turf and lighting! Best field in the area.",
      },
      {
        userId: sampleUsers[1].id,
        rating: 4,
        comment: "Nice facilities. Clean and well maintained.",
      },
      {
        userId: sampleUsers[2].id,
        rating: 5,
        comment: "Amazing experience! The booking system is so easy to use.",
      },
    ],
  });

  // Create sample gallery images
  await prisma.galleryImage.createMany({
    data: [
      { url: "/images/gallery/drone-view.jpg", caption: "Drone view of our complex", order: 1 },
      { url: "/images/gallery/night-game.jpg", caption: "Night game with LED lights", order: 2 },
      { url: "/images/gallery/players.jpg", caption: "Players enjoying a match", order: 3 },
      { url: "/images/gallery/facility.jpg", caption: "Our modern facilities", order: 4 },
      { url: "/images/gallery/field-close.jpg", caption: "Premium artificial turf", order: 5 },
      { url: "/images/gallery/team-photo.jpg", caption: "Team photo after a great game", order: 6 },
    ],
  });

  // Create sample events
  await prisma.event.createMany({
    data: [
      {
        title: "Weekend Tournament",
        description: "7v7 tournament with prizes for the winning team",
        date: new Date("2026-04-15"),
        imageUrl: "/images/events/tournament.jpg",
      },
      {
        title: "Youth Training Camp",
        description: "Professional coaching for ages 8-16",
        date: new Date("2026-04-20"),
        imageUrl: "/images/events/camp.jpg",
      },
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
