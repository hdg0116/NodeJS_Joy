export const bodyToUser = (body) => {
  const birth = body.birth ? new Date(body.birth) : null;

  return {
    email: body.email,
    password: body.password, 
    name: body.name,
    nickname: body.nickname || "",
    gender: body.gender,
    birth,
    address: body.address || "",
    detailAddress: body.detailAddress || "",
    phoneNumber: body.phoneNumber || "",
    preferences: Array.isArray(body.preferences)
      ? body.preferences
      : JSON.parse(body.preferences || "[]"),
  };
};

export const responseFromUser = (user, preferences = []) => {
  if (!user) return null;

  const preferenceList = Array.isArray(preferences)
    ? preferences.map((p) => p.food_name || p.name)
    : [];

  const formatDate = (date) => {
    const d = new Date(date);
    d.setHours(d.getHours() + 9);
    return d.toISOString().split("T")[0];
  };

  return {
    user_id: user.id,
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    password: user.password,
    gender: user.gender,
    birth: formatDate(user.birth),
    address: user.address,
    detail_address: user.detail_address || "",
    phone_num: user.phone_num || "",
    point: user.current_point || 0,
    preferences: preferenceList,
    created_at: formatDate(user.created_at || new Date()),
  };
};

export const bodyToUpdateUser = (body) => {
  const birth = body.birth ? new Date(body.birth) : null;

  return {
    name: body.name ?? undefined,
    nickname: body.nickname ?? undefined,
    gender: body.gender ?? undefined,
    birth,
    address: body.address ?? undefined,
    detailAddress: body.detail_address ?? undefined,
    phoneNumber: body.phone_num ?? undefined,
  };
};

export const responseFromUpdatedUser = (user) => {
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(d.getHours() + 9);
    return d.toISOString().split("T")[0];
  };

  return {
    user_id: user.id,
    name: user.name,
    nickname: user.nickname,
    gender: user.gender,
    birth: formatDate(user.birth),
    address: user.address,
    detail_address: user.detail_address,
    phone_num: user.phone_num,
    updated_at: formatDate(user.updated_at),
  };
};