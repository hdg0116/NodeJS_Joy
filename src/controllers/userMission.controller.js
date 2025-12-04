import { startUserMission } from "../services/userMission.service.js";
import { bodyToUserMission, responseFromUserMission } from "../dtos/userMission.dto.js";

export const handleStartUserMission = async (req, res, next) => {
  /*
    #swagger.tags = ["UserMission"]
    #swagger.summary = "유저 미션 시작 API"
    #swagger.description = `
      특정 유저가 특정 미션에 도전(시작)합니다.<br/>
      userId는 Request Body로 전달되며,<br/>
      missionId는 URL 경로 파라미터로 전달됩니다.
    `

    #swagger.parameters['missionId'] = {
      in: "path",
      required: true,
      description: "도전을 시작할 미션 ID",
      example: 1
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: {
                type: "number",
                description: "미션을 시작하는 유저의 ID",
                example: 1
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "미션 도전 시작 성공",
      content: {
        "application/json": {
          schema: {
            message: "string",
            data: {
              type: "object"
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "잘못된 요청 (이미 도전 중이거나 userId 없음)"
    }

    #swagger.responses[404] = {
      description: "해당 missionId에 대한 미션을 찾을 수 없음"
    }

    #swagger.responses[500] = {
      description: "서버 내부 오류"
    }
  */

  try {
    const { missionId } = req.params;
    const { userId } = bodyToUserMission(req.body);

    const result = await startUserMission(userId, missionId);

    res.success({
      message: "미션 도전 성공",
      data: responseFromUserMission(result),
    });

  } catch (err) {
    next(err);
  }
};