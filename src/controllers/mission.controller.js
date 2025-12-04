import { addMission, completeUserMission, listStoreMissions, listUserMissions } from "../services/mission.service.js";
import { bodyToMission, responseFromMission } from "../dtos/mission.dto.js";

export const handleAddMission = async (req, res, next) => {
  /*
    #swagger.summary = "가게 미션 생성 API"
    #swagger.tags = ["Mission"]
    #swagger.description = "특정 가게에 새로운 미션을 생성합니다."

    #swagger.parameters['storeId'] = {
      in: "path",
      required: true,
      description: "미션을 생성할 스토어 ID",
      example: 1
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["title", "point", "description"],
            properties: {
              title: { type: "string", example: "리뷰 작성하기" },
              point: { type: "integer", example: 100 },
              description: { type: "string", example: "가게 리뷰를 작성하면 포인트 100 지급" }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "미션 생성 성공",
      content: {
        "application/json": {
          example: {
            resultType: "SUCCESS",
            error: null,
            success: {
              message: "미션 등록 성공",
              data: {
                mission_id: 5,
                store_id: 1,
                title: "리뷰 작성하기",
                point: 100,
                description: "가게 리뷰를 작성하면 포인트 100 지급",
                status: "active"
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "잘못된 요청값",
      content: {
        "application/json": {
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "U001",
              reason: "title과 point는 필수 값입니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "존재하지 않는 가게",
      content: {
        "application/json": {
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "404",
              reason: "존재하지 않는 가게입니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */

  const storeId = Number(req.params.storeId);

  try {
    const missionData = bodyToMission(req.body);
    const result = await addMission(storeId, missionData);
    res.success({
      message: "미션 등록 성공",
      data: responseFromMission(result)
    });
  } catch (err) {
    next(err);
  }
};

export const handleListStoreMissions = async (req, res, next) => {
  /*
    #swagger.summary = "가게 미션 목록 조회 API"
    #swagger.tags = ["Mission"]
    #swagger.description = "해당 가게에 등록된 모든 미션 목록을 조회합니다."

    #swagger.parameters['storeId'] = {
      in: "path",
      required: true,
      description: "미션을 조회할 스토어 ID",
      example: 1
    }

    #swagger.responses[200] = {
      description: "미션 목록 조회 성공",
      content: {
        "application/json": {
          example: {
            resultType: "SUCCESS",
            error: null,
            success: {
              message: "가게 미션 목록 조회 성공",
              data: [
                {
                  missionId: 1,
                  title: "리뷰 작성하기",
                  description: "리뷰 작성 시 포인트 지급",
                  point: 50,
                  status: "active",
                  created_at: "2025-01-20"
                },
                {
                  missionId: 2,
                  title: "인증샷 올리기",
                  description: "사진 업로드 시 30 포인트",
                  point: 30,
                  status: "active",
                  created_at: "2025-01-18"
                }
              ]
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "존재하지 않는 가게",
      content: {
        "application/json": {
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "404",
              reason: "존재하지 않는 가게입니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */

  try {
    const { storeId } = req.params;
    const missions = await listStoreMissions(Number(storeId));
    res.success({
      message: "가게 미션 목록 조회 성공",
      data: missions,
    });
  } catch (err) {
    next(err);
  }
};

export const handleListUserMissions = async (req, res, next) => {
  /*
    #swagger.tags = ["Mission"]
    #swagger.summary = "상태별 미션 목록 조회 API"
    #swagger.description = "사용자가 진행 중 또는 완료한 미션 목록을 조회합니다."

    #swagger.parameters['userId'] = {
      in: "path",
      required: true,
      description: "조회할 유저 ID",
      type: "integer", 
      example: 1
    }

    #swagger.parameters['status'] = {
      in: "query",
      required: false,
      description: "조회할 미션 상태",
      type: "string",
      enum: ["IN_PROGRESS", "COMPLETED", "FAILED"],
      default: "IN_PROGRESS"
    }

      #swagger.responses[200] = {
        description: "유저 미션 목록 조회 성공",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "SUCCESS" },
                success: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "내 미션 목록 조회 성공" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          userMissionId: { type: "number", example: 22 },
                          title: { type: "string", example: "리뷰 작성하기" },
                          status: { type: "string", example: "IN_PROGRESS" }
                        }
                      }
                    }
                  }
                },
                error: { example: null }
              }
            }
          }
        }
      }


    #swagger.responses[400] = {
      description: "status 값 오류",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              success: { type: "null", example: null },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "400" },
                  reason: { type: "string", example: "status 값이 올바르지 않습니다." },
                  data: { type: "null", example: null }
                }
              }
            }
          }
        }
      }
    }
  */

  try {
    const { userId } = req.params;
    const { status } = req.query;
    const missions = await listUserMissions(Number(userId), status);
    res.success({
      message: "내 미션 목록 조회 성공",
      data: missions,
    });
  } catch (err) {
    next(err);
  }
};

export const handleCompleteUserMission = async (req, res, next) => {
  /*
    #swagger.summary = "미션 완료 처리 API"
    #swagger.tags = ["Mission"]
    #swagger.description = "유저가 진행 중인 미션을 완료 상태로 변경합니다."

    #swagger.parameters['userMissionId'] = {
      in: "path",
      required: true,
      description: "유저 미션의 고유 ID",
      example: 1
    }

    #swagger.responses[200] = {
      description: "미션 완료 성공",
      content: {
        "application/json": {
          example: {
            resultType: "SUCCESS",
            error: null,
            success: {
              message: "미션이 진행 완료로 변경되었습니다.",
              data: {
                id: 15,
                user_id: 10,
                mission_id: 5,
                status: "COMPLETED",
                completed_at: "2025-01-20T15:30:00.000Z"
              }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "존재하지 않는 유저 미션",
      content: {
        "application/json": {
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "404",
              reason: "해당 유저 미션이 존재하지 않습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "이미 완료된 미션",
      content: {
        "application/json": {
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "400",
              reason: "이미 완료된 미션입니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */

  try {
    const { userMissionId } = req.params;
    const mission = await completeUserMission(Number(userMissionId));
    res.success({
      message: "미션이 진행 완료로 변경되었습니다.",
      data: mission,
    });
  } catch (err) {
    next(err);
  }
};