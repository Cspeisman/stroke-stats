import { column, defineDb, defineTable, NOW } from 'astro:db';

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
    createdAt: column.date({ default: NOW })
  }
});

export default defineDb({
  tables: { StrokeStats }
});
