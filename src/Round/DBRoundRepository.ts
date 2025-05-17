import { db, eq, Rounds, StrokeStats, desc } from "astro:db";

import { RoundModel, HoleModel } from "./Round";
import type { RoundRepository } from "./RoundService";

export class DBRoundRepository implements RoundRepository {
  async createNewRound(
    userId: string,
    courseName: string
  ): Promise<RoundModel> {
    console.log("userId", userId);
    const round = await db
      .insert(Rounds)
      .values({
        id: crypto.randomUUID(),
        courseName: courseName,
        date: new Date(),
        active: true,
        userId: userId,
      })
      .returning();
    const roundModel = RoundModel.convertFromRound(round[0]);
    roundModel.holes = await this.getStrokesFromRound(roundModel.id);
    return roundModel;
  }

  async getActiveRound(): Promise<RoundModel | undefined> {
    const round = await db.select().from(Rounds).where(eq(Rounds.active, true));

    if (round.length === 0) {
      return undefined;
    }

    const roundModel = RoundModel.convertFromRound(round[0]);
    roundModel.holes = await this.getStrokesFromRound(roundModel.id);
    return roundModel;
  }

  async getRoundById(roundId: string): Promise<RoundModel | undefined> {
    return db
      .select()
      .from(Rounds)
      .where(eq(Rounds.id, roundId))
      .then(async (round) => {
        if (round.length === 0) {
          return undefined;
        }
        const roundModel = RoundModel.convertFromRound(round[0]);
        roundModel.holes = await this.getStrokesFromRound(roundModel.id);
        return roundModel;
      });
  }

  async getAllRoundsForUser(userId: string): Promise<RoundModel[]> {
    const rounds = await db
      .select()
      .from(Rounds)
      .where(eq(Rounds.userId, userId))
      .orderBy(desc(Rounds.date));
    return Promise.all(
      rounds.map(async (round) => {
        const roundModel = RoundModel.convertFromRound(round);
        roundModel.holes = await this.getStrokesFromRound(roundModel.id);
        return roundModel;
      })
    );
  }

  async endRound(score: number): Promise<void> {
    await db
      .update(Rounds)
      .set({ active: false, score })
      .where(eq(Rounds.active, true));
  }

  async getStrokesFromRound(roundId: string): Promise<HoleModel[]> {
    const strokes = await db
      .select()
      .from(StrokeStats)
      .where(eq(StrokeStats.roundId, roundId));
    return strokes.map(HoleModel.convertFromStrokeStat);
  }

  async deleteRound(roundId: string): Promise<boolean> {
    await db.delete(StrokeStats).where(eq(StrokeStats.roundId, roundId));
    await db.delete(Rounds).where(eq(Rounds.id, roundId));
    return true;
  }
}
