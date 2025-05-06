import type { FairwayStatuses } from "../components/GolfRound";
import type { Rounds, StrokeStats } from "astro:db";
export class RoundModel {
    static convertFromRound(round: typeof Rounds.$inferSelect): RoundModel {
        return new RoundModel(
            round.id ?? '',
            round.userId,
            round.courseName,
            round.date,
            round.active,
            round.score ?? 0,
            []
        )
    }

    constructor(
        public id: string,
        public userId: string,
        public courseName: string,
        public date: Date,
        public active: boolean,
        public score: number,
        public holes: HoleModel[] = []
    ) { }
}

export class HoleModel {
    static convertFromStrokeStat(strokeStat: typeof StrokeStats.$inferSelect): HoleModel {
        return new HoleModel(
            strokeStat.hole,
            strokeStat.strokes,
            strokeStat.hitFairway === null ? "-" : strokeStat.hitFairway ? "Hit" : "Missed",
            strokeStat.twoPuttOrLess,
            strokeStat.greenInRegulation,
            strokeStat.par
        )
    }
    constructor(
        public hole: number,
        public strokes: number,
        public fairwayStatus: FairwayStatuses,
        public isTwoPuttOrLess: boolean,
        public isGreenInRegulation: boolean,
        public par: number
    ) { }
}