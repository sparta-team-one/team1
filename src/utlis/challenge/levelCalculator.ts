import { LevelInfo } from "@/types/challengesType";
import { LEVEL_CONFIG } from "./challenges";

export const calculateLevelInfo = (totalPoints: number): LevelInfo => {
  for (const [level, config] of Object.entries(LEVEL_CONFIG)) {
    if (totalPoints >= config.min && totalPoints < config.max) {
      const currentPoints = totalPoints - config.min;
      const levelRange = config.max - config.min;
      const pointsToNextLevel = config.max - totalPoints;

      return {
        level: Number(level),
        name: config.name,
        currentPoints,
        maxPoints: levelRange,
        pointsToNextLevel,
        profile: config.profile,
        profileSmall: config.profileSmall,
        image: config.image,
        bg: config.bg,
        exp: config.exp,
        totalPoints,
        levelUpImg: config.levelUpImg
      };
    }
  }
  return {
    level: 4,
    name: LEVEL_CONFIG[4].name,
    currentPoints: 10000,
    maxPoints: 10000,
    pointsToNextLevel: 0,
    profile: LEVEL_CONFIG[4].profile,
    profileSmall: LEVEL_CONFIG[4].profileSmall, // profileSmall 키 추가했습니다
    image: LEVEL_CONFIG[4].image,
    bg: LEVEL_CONFIG[4].bg,
    exp: LEVEL_CONFIG[4].exp,
    totalPoints,
    levelUpImg: LEVEL_CONFIG[4].levelUpImg
  };
};
