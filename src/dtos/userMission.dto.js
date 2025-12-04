export const bodyToUserMission = (body) => ({
  userId: body.userId ?? body.user_id,
});

export const responseFromUserMission = (userMission) => {
  if (!userMission) return null;

  return {
    user_mission_id: userMission.id,
    user_id: userMission.user_id || userMission.userId,
    mission_id: userMission.mission_id || userMission.missionId,
    status: userMission.status,
    started_at: userMission.started_at,
  };
};