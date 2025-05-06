import type { APIRoute } from 'astro';
import { RoundService } from '../../Round/RoundService';
import { DBRoundRepository } from '../../Round/DBRoundRepository';
import { db, eq, Users } from 'astro:db';
import { getSession } from 'auth-astro/server';

export const POST: APIRoute = async ({ request }) => {
    try {
        const session = await getSession(request);
        if (!session?.user?.email) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const user = await db.select().from(Users).where(eq(Users.email, session.user.email)).limit(1);
        if (!user || user.length === 0) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const roundService = new RoundService(new DBRoundRepository(), user[0].id);
        await roundService.endRound();

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error ending round:', error);
        return new Response(JSON.stringify({ error: 'Failed to end round' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}; 