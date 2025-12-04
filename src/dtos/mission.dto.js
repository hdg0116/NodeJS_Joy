export const bodyToMission = (body) => ({
  title: body.title,
  point: body.point !== undefined ? Number(body.point) : null,
  description: body.description || "",
});

export const responseFromMission = (mission) => {
  if (!mission) return null;

  return {
    mission_id: mission.id,
    store_id: mission.store_id,
    title: mission.title,
    point: mission.point,
    description: mission.description,
    status: mission.status,
    created_at: mission.created_at,  
  };
};

export const responseFromStoreMissions = (missions) => {
  return missions.map((m) => ({
    missionId: m.id,
    title: m.title,
    description: m.description,
    point: m.point,
    status: m.status,
    created_at: m.created_at,
  }));
};

export const responseFromUserMissions = (missions) => {
  return missions.map((m) => ({
    userMissionId: m.id,
    status: m.status,
    startedAt: m.started_at,
    completedAt: m.completed_at,
    mission: {
      title: m.mission.title,
      description: m.mission.description,
      point: m.mission.point,
      storeName: m.mission.store.store,
    },
  }));
};