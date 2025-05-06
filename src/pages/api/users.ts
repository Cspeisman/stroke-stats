import { db, eq, Users } from 'astro:db';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { email } = await request.json();

        // Check if user already exists
        const existingUser = await db.select().from(Users).where(eq(Users.email, email));
        if (existingUser) {
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
        console.error('Error creating user:', error);
        return new Response(JSON.stringify({ error: 'Failed to create user' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}; 