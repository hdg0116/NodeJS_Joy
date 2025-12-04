import { findStoreById } from "../repositories/store.repository.js";
import { createReview, getMyReviews, getUserReviews } from "../repositories/review.repository.js";
import { AppError } from "../utils/AppError.js";
import { StatusCodes } from "http-status-codes";
import { responseFromMyReviews, responseFromUserReviews } from "../dtos/review.dto.js";

export const addReview = async (storeId, reviewData) => {

  if (isNaN(storeId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "storeId는 숫자여야 합니다.");
  }

  if (!reviewData.userId || !reviewData.title || !reviewData.detail || reviewData.rating === undefined) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "리뷰 작성에 필요한 필드가 누락되었습니다. (userId, title, detail, rating)"
    );
  }

  if (isNaN(reviewData.userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "userId는 숫자여야 합니다.");
  }

  if (typeof reviewData.title !== "string" || reviewData.title.trim().length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "리뷰 제목은 비어 있을 수 없습니다.");
  }

  if (reviewData.title.length > 70) {
    throw new AppError(StatusCodes.BAD_REQUEST, "리뷰 제목은 70자를 넘길 수 없습니다.");
  }

  if (typeof reviewData.detail !== "string" || reviewData.detail.trim().length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "리뷰 내용은 비어 있을 수 없습니다.");
  }

  if (isNaN(reviewData.rating)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "rating은 숫자여야 합니다.");
  }

  if (reviewData.rating < 0 || reviewData.rating > 5) {
    throw new AppError(StatusCodes.BAD_REQUEST, "rating은 0~5 사이여야 합니다.");
  }

  if (reviewData.missionId && isNaN(reviewData.missionId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "missionId는 숫자여야 합니다.");
  }

  const store = await findStoreById(storeId);

  if (!store) {
    throw new AppError(StatusCodes.NOT_FOUND, "존재하지 않는 가게입니다.");
  }

  try {
    const review = await createReview(storeId, reviewData);
    return review;
  } catch (err) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `리뷰 작성 중 오류가 발생했습니다. (${err.message})`
    );
  }
};

export const listUserReviews = async (userId) => {

  if (isNaN(userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "userId는 숫자여야 합니다.");
  }

  try {
    const reviews = await getUserReviews(userId);
    return responseFromUserReviews(reviews);

  } catch (err) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `유저 리뷰 조회 중 오류가 발생했습니다. (${err.message})`
    );
  }
};

export const listMyReviews = async (userId) => {
  if (!userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "로그인이 필요합니다.");
  }
  try {
    const reviews = await getMyReviews(userId);
    return responseFromMyReviews(reviews);
  } catch (err) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `내 리뷰 조회 중 오류가 발생했습니다. (${err.message})`
    );
  }
};