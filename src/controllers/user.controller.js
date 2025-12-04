import { bodyToUpdateUser, bodyToUser } from "../dtos/user.dto.js";
import { userSignUp, updateUserPreferences, updateUserInfo } from "../services/user.service.js";
import { AppError } from "../utils/AppError.js";
import { StatusCodes } from "http-status-codes";

export const handleUserSignUp = async (req, res, next) => {
  /*
  #swagger.summary = '회원가입 API';
  #swagger.tags = ['User'];

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["email", "password", "name"],
          properties: {
            email: { type: "string", example: "test@example.com" },
            password: { type: "string", example: "12345678" },
            name: { type: "string", example: "홍길동" },
            nickname: { type: "string", example: "길동이" },
            gender: { type: "string", example: "man" },
            birth: { type: "string", example: "2000-01-01" },
            address: { type: "string", example: "서울특별시 성동구" },
            detailAddress: { type: "string", example: "101동 1004호" },
            phoneNumber: { type: "string", example: "010-1234-5678" },
            preferences: {
              type: "array",
              items: { type: "number" },
              example: [1, 3, 7]
            }
          }
        }
      }
    }
  };

  #swagger.responses[200] = {
    description: "회원가입 성공",
    content: {
      "application/json": {
        example: {
          resultType: "SUCCESS",
          error: null,
          success: {
            message: "회원가입 성공",
            data: {
              user_id: 10,
              name: "홍길동",
              nickname: "길동이",
              email: "test@example.com",
              gender: "man",
              birth: "2000-01-01",
              address: "서울특별시 성동구",
              detail_address: "101동 1004호",
              phone_num: "010-1234-5678",
              point: 0,
              preferences: ["한식","중식"],
              created_at: "2025-01-10"
            }
          }
        }
      }
    }
  };
*/

  try {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body);

    const user = await userSignUp(bodyToUser(req.body));

    res.success({
      message: "회원가입 성공",
      data: user,
    });
  } catch (err) {
    next(err instanceof AppError ? err : new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
  }
};

export const handleUpdateUserPreferences = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    if (!preferences || !Array.isArray(preferences)) {
      throw new AppError(StatusCodes.BAD_REQUEST, "preferences는 배열 형태여야 합니다.");
    }

    const updatedPreferences = await updateUserPreferences(userId, preferences);

    res.success({
      message: "선호 카테고리가 수정되었습니다.",
      data: updatedPreferences,
    });
  } catch (err) {
    next(err instanceof AppError ? err : new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
  }
};

export const handleUpdateUserInfo = async (req, res, next) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = '사용자 정보 수정 API'
    #swagger.description = '사용자 프로필 정보를 수정합니다.'

    #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      description: '수정할 사용자 ID',
      type: 'integer',
      example: 1
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "홍길동" },
              nickname: { type: "string", example: "길동이" },
              gender: { type: "string", example: "man" },
              birth: { type: "string", example: "2001-04-25" },
              address: { type: "string", example: "서울 강남구" },
              detail_address: { type: "string", example: "101동 1001호" },
              phone_num: { type: "string", example: "010-1234-5678" }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "사용자 정보 수정 성공",
      content: {
        "application/json": {
          example: {
            resultType: "SUCCESS",
            error: null,
            success: {
              message: "사용자 정보 수정 완료",
              data: {
                user_id: 12,
                name: "홍길동",
                nickname: "길동이",
                gender: "man",
                birth: "2001-04-25",
                address: "서울 강남구",
                detail_address: "101동 1001호",
                phone_num: "010-1234-5678",
                updated_at: "2025-11-22"
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "잘못된 요청 (userId가 숫자가 아닐 때, 형식이 잘못된 입력값)",
      content: {
        "application/json": {
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "U001",
              reason: "userId는 숫자여야 합니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "존재하지 않는 사용자",
      content: {
        "application/json": {
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "U002",
              reason: "존재하지 않는 사용자입니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[500] = {
      description: "서버 내부 오류",
      content: {
        "application/json": {
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "unknown",
              reason: "사용자 정보 수정 중 오류가 발생했습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */

  try {
    const { userId } = req.params;

    const updateData = bodyToUpdateUser(req.body);

    const updatedUser = await updateUserInfo(userId, updateData);

    res.success({
      message: "사용자 정보 수정 완료",
      data: updatedUser,
    });

  } catch (err) {
    next(err instanceof AppError 
      ? err 
      : new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
  }
};