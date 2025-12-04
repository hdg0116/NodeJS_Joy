import { prisma } from "../db.config.js";

export const createMission = async (storeId, data) => {
  return prisma.mission.create({
    data: {
      store_id: storeId,
      title: data.title,
      point: data.point,
      description: data.description,
      status: "active",
    },
    select: { id: true },
  });
};

export const getStoreMissions = async (storeId) => {
  return prisma.mission.findMany({
    where: { store_id: storeId, status: "active" },
    orderBy: { created_at: "desc" },
  });
};

export const getUserMissions = async (userId, status) => {
  return prisma.user_mission.findMany({
    where: { user_id: userId, status },
    select: {
      id: true,
      status: true,
      started_at: true,
      completed_at: true,
      mission: {
        select: {
          title: true,
          description: true,
          point: true,
          store: { select: { store: true } },
        },
      },
    },
    orderBy: { started_at: "desc" },
  });
};

export const updateUserMissionToCompleted = async (userMissionId) => {
  return prisma.user_mission.update({
    where: { id: userMissionId },
    data: {
      status: "COMPLETED",
      completed_at: new Date(),
    },
  });
};