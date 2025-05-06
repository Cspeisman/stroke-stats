import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { DBRoundRepository } from "../../Round/DBRoundRepository";
import { RoundService } from "../../Round/RoundService";

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const roundService = new RoundService(
      new DBRoundRepository(),
      session.user.email
    );
    await roundService.endRound();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error ending round:", error);
    return new Response(JSON.stringify({ error: "Failed to end round" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
