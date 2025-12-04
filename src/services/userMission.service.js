import { findUserMissionByUserAndMission, createUserMission } from "../repositories/userMission.repository.js";
import { AppError } from "../utils/AppError.js";
import { StatusCodes } from "http-status-codes";

export const startUserMission = async (userId, missionId) => {
  try {
    if (!userId) {
      throw new AppError(StatusCodes.BAD_REQUEST, "user_id가 필요합니다.");
    }

    const existing = await findUserMissionByUserAndMission(userId, missionId);
    if (existing) {
      throw new AppError(StatusCodes.BAD_REQUEST, "이미 도전 중인 미션입니다.");
    }

    const created = await createUserMission(userId, missionId);

    return {
      user_mission_id: created.id,
      user_id: userId,
      mission_id: missionId,
      status: "IN_PROGRESS",
      started_at: created.started_at,
    };

  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(500, `미션 시작 중 오류: ${err.message}`);
  }
};