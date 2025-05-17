import type { HoleModel, RoundModel } from "./Round";

export interface RoundRepository {
  getRoundById(roundId: string): Promise<RoundModel | undefined>;
  deleteRound(roundId: string): Promise<boolean>;
  getAllRoundsForUser: (userId: string) => Promise<RoundModel[]>;
  getActiveRound: () => Promise<RoundModel | undefined>;
  createNewRound: (userId: string, courseName: string) => Promise<RoundModel>;
  endRound: (score: number) => Promise<void>;
  getStrokesFromRound: (roundId: string) => Promise<HoleModel[]>;
}

export class RoundService {
  roundRepository: RoundRepository;
  userId: string;

  constructor(roundRepository: RoundRepository, userId: string) {
    this.roundRepository = roundRepository;
    this.userId = userId;
  }

  async getActiveRound() {
    return await this.roundRepository.getActiveRound();
  }

  async getRoundById(roundId: string) {
    return await this.roundRepository.getRoundById(roundId);
  }

  async createNewRound(courseName: string) {
    return await this.roundRepository.createNewRound(this.userId, courseName);
  }

  async endRound() {
    const activeRound = await this.getActiveRound();
    if (!activeRound) {
      return;
    }

    const strokes = await this.roundRepository.getStrokesFromRound(
      activeRound.id
    );
    const totalScore = strokes.reduce((sum, stroke) => sum + stroke.strokes, 0);

    await this.roundRepository.endRound(totalScore);
  }

  async getAllRounds() {
    return await this.roundRepository.getAllRoundsForUser(this.userId);
  }

  async deleteRound(roundId: string) {
    return await this.roundRepository.deleteRound(roundId);
  }
}
