import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError.js";
import {
  addUser,
  getUser,
  setPreferences,
  getUserPreferencesByUserId,
  updateUser,
} from "../repositories/user.repository.js";
import { responseFromUpdatedUser, responseFromUser } from "../dtos/user.dto.js";

export const userSignUp = async (data) => {
  if (!data.email || !data.password || !data.name) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "회원가입에 필요한 필드가 누락되었습니다.",
      data,
      "U001"
    );
  }

  if (!data.email.includes("@")) {
    throw new AppError(400, "이메일 형식이 올바르지 않습니다.");
  }

  if (data.password.length < 8) {
    throw new AppError(400, "비밀번호는 최소 8자 이상이어야 합니다.");
  }

  const allowedGender = ["man", "woman", null];
  if (!allowedGender.includes(data.gender)) {
    throw new AppError(400, "gender 값이 올바르지 않습니다.");
  }

  if (data.phoneNumber && !/^010-\d{4}-\d{4}$/.test(data.phoneNumber)) {
    throw new AppError(400, "휴대폰 번호 형식이 올바르지 않습니다.");
  }

  if (data.nickname.length > 40) {
    throw new AppError(400, "닉네임은 40자를 넘길 수 없습니다.");
  }

  if (data.preferences.some((id) => isNaN(id))) {
    throw new AppError(400, "preferences 값은 숫자여야 합니다.");
  }

  try {
    const userId = await addUser(data);
    const user = await getUser(userId);

    if (!user) {
      throw new AppError(404, "생성된 사용자 정보를 찾을 수 없습니다.");
    }
    
    const preferences = await getUserPreferencesByUserId(joinUserId);

    return responseFromUser(user, preferences);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `회원가입 처리 중 오류가 발생했습니다. (${err.message})`,
      null,
      "U999"
    );
  }
};

export const updateUserPreferences = async (userId, preferences) => {
  if (!userId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "userId가 필요합니다.");
  }

  if (isNaN(userId)) {
    throw new AppError(400, "userId는 숫자여야 합니다.");
  }

  if (preferences.length === 0) {
    throw new AppError(400, "최소 한 개의 선호 카테고리를 선택해야 합니다.");
  }

  const user = await getUser(userId);
  if (!user) {
    throw new AppError(404, "존재하지 않는 사용자입니다.");
  }

  try {
    await setPreferences(userId, preferences);
    const updatedPreferences = await getUserPreferencesByUserId(userId);
    return updatedPreferences;
  } catch (err) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `선호 카테고리 수정 중 오류가 발생했습니다. (${err.message})`
    );
  }
};

export const updateUserInfo = async (userId, updateData) => {
  if (!userId || isNaN(userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "userId는 숫자여야 합니다.");
  }

  const user = await getUser(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "존재하지 않는 사용자입니다.");
  }

  const updated = await updateUser(userId, updateData);

  return responseFromUpdatedUser(updated);
};