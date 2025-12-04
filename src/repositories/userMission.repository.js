import { prisma } from "../db.config.js";

export const findUserMissionByUserAndMission = async (userId, missionId) => {
  return prisma.user_mission.findFirst({
    where: {
      user_id: BigInt(userId),
      mission_id: BigInt(missionId),
    },
  });
};

export const createUserMission = async (userId, missionId) => {
  return prisma.user_mission.create({
    data: {
      user_id: BigInt(userId),
      mission_id: BigInt(missionId),
      status: "IN_PROGRESS",
      started_at: new Date(),
    },
  });
};