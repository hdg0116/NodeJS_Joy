import { StatusCodes } from "../../node_modules/http-status-codes/build/cjs/status-codes.js";
import { responseFromReviews } from "../dtos/store.dto.js";
import { findStoreById, getAllStoreReviews } from "../repositories/store.repository.js";
import { AppError } from "../utils/AppError.js";

export const listStoreReviews = async (storeId, cursor = 0) => {

  if (typeof storeId !== "number") {
    throw new AppError(StatusCodes.BAD_REQUEST, "storeId는 숫자 타입이어야 합니다.");
  }

  if (!Number.isInteger(storeId) || storeId <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "storeId는 1 이상의 정수여야 합니다.");
  }

  if (typeof cursor !== "number") {
    throw new AppError(StatusCodes.BAD_REQUEST, "cursor는 숫자 타입이어야 합니다.");
  }

  if (!Number.isInteger(cursor) || cursor < 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "cursor는 0 이상의 정수여야 합니다.");
  }

  const store = await findStoreById(storeId);

  if (!store) {
    throw new AppError(StatusCodes.NOT_FOUND, "존재하지 않는 가게입니다.");
  }

  try {
    const reviews = await getAllStoreReviews(storeId, cursor);

    return responseFromReviews(reviews);

  } catch (err) {
    if (err instanceof AppError) throw err;

    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `스토어 리뷰 조회 중 오류가 발생했습니다. (${err.message})`
    );
  }
};