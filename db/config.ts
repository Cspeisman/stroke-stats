import { column, defineDb, defineTable, NOW } from 'astro:db';

export const Users = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    email: column.text({ unique: true }),
    createdAt: column.date({ default: NOW })
  }
});

export const Rounds = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    courseName: column.text(),
    date: column.date(),
    active: column.boolean({ default: true }),
    userId: column.text({ references: () => Users.columns.id }),
    score: column.number({ optional: true }),
    createdAt: column.date({ default: NOW })
  }
});

export const StrokeStats = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    hole: column.number(),
    par: column.number(),
    hitFairway: column.boolean({ optional: true }),
    twoPuttOrLess: column.boolean(),
    greenInRegulation: column.boolean(),
    strokes: column.number(),
    notes: column.text(),
    roundId: column.text({ references: () => Rounds.columns.id }),
    createdAt: column.date({ default: NOW })
  }
});

export default defineDb({
  tables: { Users, Rounds, StrokeStats }
});
