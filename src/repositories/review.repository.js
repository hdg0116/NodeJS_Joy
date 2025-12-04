import { prisma } from "../db.config.js";

export const createReview = async (storeId, data) => {
  return prisma.review.create({
    data: {
      store_id: storeId,
      user_id: data.userId,
      title: data.title,
      detail: data.detail,
      rating: data.rating,
      status: "active",
    },
  });
};

export const getUserReviews = async (userId) => {
  return prisma.review.findMany({
    where: { user_id: userId, status: "active" },
    select: {
      id: true,
      title: true,
      detail: true,
      rating: true,
      created_at: true,
      store: { select: { store: true } },
    },
    orderBy: { created_at: "desc" },
  });
};

export const getMyReviews = async (userId) => {
  return prisma.review.findMany({
    where: {
      user_id: userId,
      status: "active",
    },
    select: {
      id: true,
      title: true,
      detail: true,
      rating: true,
      created_at: true,
      store: { select: { store: true } },
    },
    orderBy: { created_at: "desc" },
  });
};