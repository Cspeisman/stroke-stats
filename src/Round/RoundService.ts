import type { HoleModel, RoundModel } from "./Round";

export interface RoundRepository {
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
}
