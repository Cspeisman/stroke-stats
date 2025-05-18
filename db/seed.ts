import { db, Rounds, StrokeStats } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  // Create an active round
  const round = await db.insert(Rounds).values({
    id: "round-1",
    courseName: "Local Golf Course",
    date: new Date(),
    active: true,
    userId: "cspeisman@gmail.com", // Assuming this user exists
    score: 42,
  });

  // Create 6 stroke stats for the round
  await db.insert(StrokeStats).values([
    {
      id: "stat-1",
      hole: 1,
      par: 4,
      hitFairway: true,
      twoPuttOrLess: true,
      greenInRegulation: true,
      strokes: 4,
      notes: "Good drive, solid approach",
      roundId: "round-1",
    },
    {
      id: "stat-2",
      hole: 2,
      par: 3,
      hitFairway: false,
      twoPuttOrLess: true,
      greenInRegulation: true,
      strokes: 3,
      notes: "Missed fairway but recovered well",
      roundId: "round-1",
    },
    {
      id: "stat-3",
      hole: 3,
      par: 5,
      hitFairway: true,
      twoPuttOrLess: false,
      greenInRegulation: true,
      strokes: 6,
      notes: "Three-putt on the green",
      roundId: "round-1",
    },
    {
      id: "stat-4",
      hole: 4,
      par: 4,
      hitFairway: true,
      twoPuttOrLess: true,
      greenInRegulation: true,
      strokes: 4,
      notes: "Solid par",
      roundId: "round-1",
    },
    {
      id: "stat-5",
      hole: 5,
      par: 3,
      hitFairway: false,
      twoPuttOrLess: true,
      greenInRegulation: false,
      strokes: 4,
      notes: "Missed green, good chip",
      roundId: "round-1",
    },
    {
      id: "stat-6",
      hole: 6,
      par: 4,
      hitFairway: true,
      twoPuttOrLess: true,
      greenInRegulation: true,
      strokes: 4,
      notes: "Consistent play",
      roundId: "round-1",
    },
  ]);

  const strokes = new Array(18).fill(0).map((_, i) => {
    return {
      id: `id-${i + 1}`,
      hole: i + 1,
      par: 4,
      hitFairway: true,
      twoPuttOrLess: true,
      greenInRegulation: true,
      strokes: 4,
      notes: "Good drive, solid approach",
      roundId: "round-2",
    };
  });

  const round2 = await db.insert(Rounds).values({
    id: "round-2",
    courseName: "Round 2 Course",
    date: new Date(),
    active: true,
    userId: "cspeisman@gmail.com", // Assuming this user exists
    score: strokes.reduce((acc, stat) => acc + stat.strokes, 0),
  });

  await db.insert(StrokeStats).values(strokes);
}
