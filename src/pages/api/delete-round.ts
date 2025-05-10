import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { DBRoundRepository } from "../../Round/DBRoundRepository";
import { RoundService } from "../../Round/RoundService";

export const DELETE: APIRoute = async ({ request }) => {
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

    const data = await request.json();
    if (!data.roundId) {
      return new Response(JSON.stringify({ error: "Round ID is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const roundService = new RoundService(
      new DBRoundRepository(),
      session.user.email
    );
    await roundService.deleteRound(data.roundId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error deleting round:", error);
    return new Response(JSON.stringify({ error: "Failed to delete round" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
