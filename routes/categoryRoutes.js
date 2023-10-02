import express from "express";

import { prisma } from "../index.js";

const categoryRouter = express.Router();


categoryRouter.get("/", async (req, res, next) => {
  try {
    const categoryOrder = [
      "game",
      "sports",
      "business",
      "crypto",
      "television",
      "celebrity",
      "animal_and_pets",
      "anime",
      "art",
      "cars_and_motor_vehicles",
      "crafts_and_diy",
    ];

    const categories = await prisma.category.findMany({
      include: {
        topics: true,
      },
    });

    categories.sort(
      (a, b) => categoryOrder.indexOf(a.name) - categoryOrder.indexOf(b.name)
    );

    res.json({
      success: true,
      categories,
    });
  } catch (err) {
    next(err);
  }
});
