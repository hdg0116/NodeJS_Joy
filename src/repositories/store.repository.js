import { prisma } from "../db.config.js";

export const findStoreById = async (storeId) => {
  return prisma.store.findUnique({
    where: { id: Number(storeId) },
  });
};

export const getAllStoreReviews = async (storeId, cursor = 0) => {
  return prisma.review.findMany({
    select: {
      id: true,
      title: true,
      detail: true,
      rating: true,
      created_at: true,
      user_id: true,
      store: {
        select: {
          id: true,
          store: true,
          address: true,
          description: true,
        },
      },
    },
    where: {
      store_id: Number(storeId),
      status: "active", 
      id: { gt: cursor },   
    },
    orderBy: { id: "asc" },
    take: 10,
  });
};