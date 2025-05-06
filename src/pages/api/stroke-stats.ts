import { db, StrokeStats } from 'astro:db';
import type { APIRoute } from 'astro';

export async function GET() {
    try {
        const stats = await db.select().from(StrokeStats);
        return new Response(JSON.stringify(stats), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch stroke stats' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();

        // Validate required fields
        if (!data.hole || !data.par || !data.strokes) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const newStat = await db.insert(StrokeStats).values({
            id: crypto.randomUUID(),
            hole: data.hole,
            par: data.par,
            hitFairway: data.hitFairway ?? null,
            twoPuttOrLess: data.twoPuttOrLess ?? null,
            greenInRegulation: data.greenInRegulation ?? null,
            strokes: data.strokes,
            notes: data.notes ?? "",
            roundId: data.roundId
        });

        return new Response(JSON.stringify(newStat), {
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error saving stroke stats:', error);
        return new Response(JSON.stringify({ error: 'Failed to save stroke stat' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 