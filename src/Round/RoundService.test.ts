import { HoleModel, RoundModel } from "./Round";
import { RoundService, type RoundRepository } from "./RoundService";
import { describe, it, expect, beforeEach, vi } from "vitest";

class FakeRoundRepository implements RoundRepository {
  private rounds: RoundModel[] = [];
  private strokes: HoleModel[] = [];
  async createNewRound(
    userId: string,
    courseName: string
  ): Promise<RoundModel> {
    const newRound = new RoundModel(
      crypto.randomUUID(),
      userId,
      courseName,
      new Date(),
      true,
      0,
      []
    );
    this.rounds.push(newRound);
    return newRound;
  }

  async getActiveRound() {
    const activeRounds = this.rounds.filter((round) => round.active);
    return activeRounds[0];
  }
  async getRoundById(roundId: string): Promise<RoundModel | undefined> {
    return this.rounds.find((round) => round.id === roundId);
  }
  async getAllRoundsForUser(testUserId: string) {
    return this.rounds.filter((round) => round.userId === testUserId);
  }
  async endRound(score: number) {
    const round = await this.getActiveRound();
    if (round) {
      round.active = false;
      round.score = score;
    }
  }
  async getStrokesFromRound(_roundId: string): Promise<HoleModel[]> {
    return this.strokes;
  }

  async deleteRound(roundId: string): Promise<boolean> {
    this.rounds = this.rounds.filter((round) => round.id !== roundId);
    return true;
  }
}

describe("RoundService", () => {
  let roundService: RoundService;
  let fakeRepository: FakeRoundRepository;
  const testUserId = "test-user-123";

  beforeEach(() => {
    fakeRepository = new FakeRoundRepository();
    roundService = new RoundService(fakeRepository, testUserId);
  });

  describe("getActiveRound", () => {
    it("should return undefined when no active round exists", async () => {
      const result = await roundService.getActiveRound();
      expect(result).toBeUndefined();
    });
    it("should return the active round when one exists", async () => {
      const testRound = await fakeRepository.createNewRound(
        testUserId,
        "Test Course"
      );
      const result = await roundService.getActiveRound();
      expect(result).toEqual(testRound);
    });
  });

  describe("createNewRound", () => {
    it("should create a new round with the correct userId", async () => {
      const result = await roundService.createNewRound("Test Course");
      expect(result.userId).toBe(testUserId);
      expect(result.active).toBe(true);
      expect(result.courseName).toBe("Test Course");
    });
  });

  describe("endRound", () => {
    it("should mark a round as inactive", async () => {
      await fakeRepository.createNewRound(testUserId, "Test Course");
      await roundService.endRound();
      expect(await fakeRepository.getActiveRound()).toBeUndefined();
    });
    it("should calculate the score for a round", async () => {
      const testRound = await fakeRepository.createNewRound(
        testUserId,
        "Test Course"
      );
      fakeRepository.getStrokesFromRound = vi.fn().mockResolvedValue([
        {
          id: crypto.randomUUID(),
          roundId: testRound.id,
          strokes: 5,
        },
        {
          id: crypto.randomUUID(),
          roundId: testRound.id,
          strokes: 5,
        },
      ]);
      await roundService.endRound();
      const result = await fakeRepository.getAllRoundsForUser(testUserId);
      expect(result[0].score).toBe(10);
    });
  });

  describe("deleteRound", () => {
    it("should delete a round", async () => {
      const testRound = await fakeRepository.createNewRound(
        testUserId,
        "Test Course"
      );
      await roundService.deleteRound(testRound.id);
      expect(await fakeRepository.getAllRoundsForUser(testUserId)).toHaveLength(
        0
      );
    });
  });

  describe("getRoundById", () => {
    it("should return the correct round by id", async () => {
      const testRound = await fakeRepository.createNewRound(
        testUserId,
        "Test Course"
      );
      const result = await roundService.getRoundById(testRound.id);
      expect(result).toEqual(testRound);
    });

    it("should return undefined for a non-existent round id", async () => {
      const result = await roundService.getRoundById("non-existent-id");
      expect(result).toBeUndefined();
    });
  });

  describe("getAllRounds", () => {
    it("should return all rounds for the user", async () => {
      await fakeRepository.createNewRound(testUserId, "Course 1");
      await fakeRepository.createNewRound(testUserId, "Course 2");
      const rounds = await roundService.getAllRounds();
      expect(rounds).toHaveLength(2);
      expect(rounds.every((r) => r.userId === testUserId)).toBe(true);
    });
  });
});
