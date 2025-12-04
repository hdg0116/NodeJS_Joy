import { prisma } from "../db.config.js";

export const addUser = async (data) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // 이메일 중복 검사
      const existingUser = await tx.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        // 기존 유저 정보 업데이트
        await tx.user.update({
          where: { id: existingUser.id },
          data: {
            name: data.name ?? existingUser.name,
            nickname: data.nickname ?? existingUser.nickname,
            gender: data.gender ?? existingUser.gender,
            birth: data.birth ?? existingUser.birth,
            address: data.address ?? existingUser.address,
            detailAddress: data.detailAddress ?? existingUser.detailAddress,
            phoneNumber: data.phoneNumber ?? existingUser.phoneNumber,
            password: existingUser.password, 
            updatedAt: new Date(),
          },
        });
        
        if (data.preferences?.length > 0) {
          await tx.user_preference.deleteMany({ where: { user_id: existingUser.id } });
          await tx.user_preference.createMany({
            data: data.preferences.map((foodId) => ({
              user_id: existingUser.id,
              food_id: foodId,
              status: "active",
              created_at: new Date(),
              updated_at: new Date(),
            })),
          });
        }

        return existingUser.id; // 기존 유저 ID 그대로 반환
      }

      // 유저 생성
      const createdUser = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          nickname: data.nickname,
          gender: data.gender,
          birth: data.birth,
          address: data.address,
          detailAddress: data.detailAddress,
          phoneNumber: data.phoneNumber,
          password: data.password,
          status: "active",
        },
        select: { id: true },
      });

      if (data.preferences?.length > 0) {
        await tx.user_preference.createMany({
          data: data.preferences.map((foodId) => ({
            user_id: createdUser.id,
            food_id: foodId,
            status: "active",
            created_at: new Date(),
            updated_at: new Date(),
          })),
        });
      }

      return createdUser.id;
    });
  } catch (err) {
    throw err; 
  }
};

export const getUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) return null;

    return user;
  } catch (err) {
    throw err;
  }
};

export const setPreferences = async (userId, preferences) => {
  try {
    await prisma.user_preference.deleteMany({
      where: { user_id: Number(userId) },
    });

    if (preferences.length > 0) {
      await prisma.user_preference.createMany({
        data: preferences.map((foodId) => ({
          user_id: Number(userId),
          food_id: foodId,
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        })),
      });
    }
  } catch (err) {
    throw err;
  }
};

export const getUserPreferencesByUserId = async (userId) => {
  try {
    const preferences = await prisma.user_preference.findMany({
      where: { user_id: Number(userId) },
      include: {
        food: {  
          select: { name: true }
        }
      },
    });

    return preferences.map((p) => ({
      id: p.id,
      user_id: p.user_id,
      food_id: p.food_id,
      food_name: p.food?.name,
    }));
  } catch (err) {
    throw err;
  }
};

export const updateUser = async (userId, data) => {
  return prisma.user.update({
    where: { id: Number(userId) },
    data: {
      name: data.name,
      nickname: data.nickname,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
      updatedAt: new Date(),
    },
  });
};