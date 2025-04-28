import { column, defineTable, defineDb, NOW } from 'astro:db';

export const StrokeStats = defineTable({
    columns: {
        id: column.text({ primaryKey: true }),
        hole: column.number(),
        par: column.number(),
        hitFairway: column.boolean(),
        twoPuttOrLess: column.boolean(),
        greenInRegulation: column.boolean(),
        strokes: column.number(),
        notes: column.text(),
        createdAt: column.date({ default: NOW })
    }
})

export default defineDb({
    tables: { StrokeStats }
}); 
