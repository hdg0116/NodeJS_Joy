import { findStoreById } from "../repositories/store.repository.js";
import { createMission, getStoreMissions, getUserMissions, updateUserMissionToCompleted } from "../repositories/mission.repository.js";
import { AppError } from "../utils/AppError.js";
import { StatusCodes } from "http-status-codes";
import { responseFromStoreMissions, responseFromUserMissions } from "../dtos/mission.dto.js";

export const addMission = async (storeId, missionData) => {

  if (missionData.title === undefined || missionData.point === undefined) {
    throw new AppError(StatusCodes.BAD_REQUEST, "title과 point는 필수 값입니다.");
  }

  if (typeof storeId !== "number") {
    throw new AppError(StatusCodes.BAD_REQUEST, "storeId는 숫자 타입이어야 합니다.");
  }

  if (typeof missionData.title !== "string") {
    throw new AppError(StatusCodes.BAD_REQUEST, "title은 문자열이어야 합니다.");
  }

  if (typeof missionData.point !== "number" || Number.isNaN(missionData.point)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "point는 숫자 타입이어야 합니다.");
  }

  if (typeof missionData.description !== "string") {
    throw new AppError(StatusCodes.BAD_REQUEST, "description은 문자열이어야 합니다.");
  }

  if (!Number.isInteger(storeId) || storeId <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "storeId는 1 이상의 정수여야 합니다.");
  }

  if (!Number.isInteger(missionData.point) || missionData.point < 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "point는 0 이상의 정수여야 합니다.");
  }

  if (missionData.title.trim().length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "title은 비어 있을 수 없습니다.");
  }

  if (missionData.title.length > 30) {
    throw new AppError(StatusCodes.BAD_REQUEST, "미션 제목은 30자를 넘길 수 없습니다.");
  }

  const store = await findStoreById(storeId);
  if (!store) {
    throw new AppError(StatusCodes.NOT_FOUND, "존재하지 않는 가게입니다.");
  }

  try {
    const missionId = await createMission(storeId, missionData);
    return { missionId, ...missionData };

  } catch (err) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `미션 생성 중 오류 발생: ${err.message}`
    );
  }
};

export const listStoreMissions = async (storeId) => {

  if (typeof storeId !== "number") {
    throw new AppError(StatusCodes.BAD_REQUEST, "storeId는 숫자 타입이어야 합니다.");
  }

  if (!Number.isInteger(storeId) || storeId <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "storeId는 1 이상의 정수여야 합니다.");
  }

  const store = await findStoreById(storeId);
  if (!store) {
    throw new AppError(StatusCodes.NOT_FOUND, "존재하지 않는 가게입니다.");
  }

  try {
    const missions = await getStoreMissions(storeId);
    return responseFromStoreMissions(missions);

  } catch (err) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `스토어 미션 조회 중 오류: ${err.message}`
    );
  }
};

export const listUserMissions = async (userId, status = "IN_PROGRESS") => {

  if (typeof userId !== "number") {
    throw new AppError(StatusCodes.BAD_REQUEST, "userId는 숫자 타입이어야 합니다.");
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "userId는 1 이상의 정수여야 합니다.");
  }

  const allowedStatus = ["IN_PROGRESS", "COMPLETED", "FAILED"];
  if (!allowedStatus.includes(status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "status 값이 올바르지 않습니다.");
  }

  try {
    const missions = await getUserMissions(userId, status);
    return responseFromUserMissions(missions);

  } catch (err) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `유저 미션 조회 중 오류: ${err.message}`
    );
  }
};

export const completeUserMission = async (userMissionId) => {

  if (typeof userMissionId !== "number") {
    throw new AppError(StatusCodes.BAD_REQUEST, "userMissionId는 숫자 타입이어야 합니다.");
  }

  if (!Number.isInteger(userMissionId) || userMissionId <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "userMissionId는 1 이상의 정수여야 합니다.");
  }

  const mission = await getUserMissionById(userMissionId);
  if (!mission) {
    throw new AppError(StatusCodes.NOT_FOUND, "해당 유저 미션이 존재하지 않습니다.");
  }

  if (mission.status === "COMPLETED") {
    throw new AppError(StatusCodes.BAD_REQUEST, "이미 완료된 미션입니다.");
  }

  try {
    return await updateUserMissionToCompleted(userMissionId);

  } catch (err) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `미션 완료 처리 중 오류: ${err.message}`
    );
  }
};