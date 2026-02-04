import { API_BASE_URL } from "../config";

export interface TierReward {
  tier: number;
  mcapThreshold: number;
  maxSpots: number;
  buffdogePercentage: number;
  solPercentage: number;
  spotsUsed: number;
  spotsRemaining: number;
}

export interface TemplePhase {
  _id: string;
  phaseNumber: number;
  startDate: string;
  endDate: string;
  totalBuffdogeRewards: number;
  totalSolRewards: number;
  isActive: boolean;
  tierRewards: TierReward[];
}

export interface TempleAchievement {
  _id: string;
  token: {
    _id: string;
    name: string;
    symbol: string;
    logo: string;
    marketCap: number;
  };
  phase: string;
  tier: number;
  mcapThreshold: number;
  achievedAt?: string;
  timerStartedAt?: string;
  spotNumber: number;
  buffdogeReward: number;
  solReward: number;
}

export const getTemplePhase = async (): Promise<{ active: boolean; phase?: TemplePhase; message?: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/temple/phase/current`);
  if (!response.ok) {
    throw new Error("Failed to fetch temple phase");
  }
  return response.json();
};

export const getAchievements = async (phaseId?: string): Promise<{ achievements: TempleAchievement[] }> => {
  const url = phaseId
    ? `${API_BASE_URL}/api/temple/achievements?phaseId=${phaseId}`
    : `${API_BASE_URL}/api/temple/achievements`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch achievements");
  }
  return response.json();
};
