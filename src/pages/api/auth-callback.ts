import { db, eq, Users } from 'astro:db';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { email } = await request.json();

        if (!email) {
            return new Response(JSON.stringify({ error: 'No user email found' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Check if user already exists
        const existingUsers = await db.select().from(Users).where(eq(Users.email, email));

        if (existingUsers[0]) {
            return new Response(JSON.stringify({ message: 'User already exists' }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Create new user
        const newUser = await db.insert(Users).values({
            id: crypto.randomUUID(),
            email
        });

        return new Response(JSON.stringify(newUser), {
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error in auth callback:', error);
        return new Response(JSON.stringify({ error: 'Failed to process authentication' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}; 