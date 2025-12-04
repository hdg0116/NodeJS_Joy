import { addReview, listMyReviews, listUserReviews } from "../services/review.service.js";
import { bodyToReview, responseFromReview, responseFromUserReviews } from "../dtos/review.dto.js";

export const handleAddReview = async (req, res, next) => {
  /*
  #swagger.tags = ['Review']
  #swagger.summary = '리뷰 작성 API'
  #swagger.description = '특정 가게에 리뷰를 작성합니다.'

  #swagger.parameters['storeId'] = {
        in: 'path',
        description: '리뷰를 작성할 가게 ID',
        required: true,
        type: 'integer',
        example: 1
      }

      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["userId", "title", "detail", "rating"],
              properties: {
                userId: { type: "integer", example: 12 },
                title: { type: "string", example: "맛있는 집!" },
                detail: { type: "string", example: "음식이 전반적으로 깔끔하고 맛있었어요." },
                rating: { type: "number", example: 4.5 },
                missionId: { type: "integer", nullable: true, example: 2 }
              }
            }
          }
        }
      }

      #swagger.responses[200] = {
        description: '리뷰 작성 성공',
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                resultType: "SUCCESS",
                error: null,
                success: {
                  message: "리뷰 등록 성공",
                  data: {
                    review_id: 10,
                    store_id: 3,
                    user_id: 12,
                    title: "맛있는 집!",
                    detail: "음식이 전반적으로 깔끔하고 맛있었어요.",
                    rating: 4.5,
                    created_at: "2025-01-20"
                  }
                }
              }
            }
          }
        }
      }

      #swagger.responses[400] = {
        description: "잘못된 요청 (필드 누락, 형식 오류 등)",
        content: {
          "application/json": {
            schema: {
              example: {
                resultType: "FAIL",
                error: {
                  errorCode: "U001",
                  reason: "리뷰 제목은 비어 있을 수 없습니다.",
                  data: null
                },
                success: null
              }
            }
          }
        }
      }

      #swagger.responses[404] = {
        description: "존재하지 않는 가게",
        content: {
          "application/json": {
            schema: {
              example: {
                resultType: "FAIL",
                error: {
                  errorCode: "NOT_FOUND",
                  reason: "존재하지 않는 가게입니다.",
                  data: null
                },
                success: null
              }
            }
          }
        }
      }
    */
  try {
    const { storeId } = req.params;
    const reviewData = bodyToReview(req.body);
    const review = await addReview(storeId, reviewData);
    res.success({
      message: "리뷰 등록 성공",
      data: responseFromReview(review),
    });
  } catch (err) {
    next(err);
  }
};

export const handleListUserReviews = async (req, res, next) => {
  /*
  #swagger.tags = ['Review']
  #swagger.summary = '사용자가 작성한 리뷰 목록 조회 API'
  #swagger.description = '특정 사용자가 작성한 리뷰 목록을 조회합니다.'

      #swagger.parameters['userId'] = {
        in: 'path',
        description: '조회할 사용자 ID',
        required: true,
        type: 'integer', 
        example: 1
      }

      #swagger.responses[200] = {
        description: '유저 리뷰 목록 조회 성공',
        content: {
          "application/json": {
            schema: {
              example: {
                resultType: "SUCCESS",
                error: null,
                success: {
                  message: "내가 작성한 리뷰 목록 조회 성공",
                  data: [
                    {
                      reviewId: 10,
                      title: "맛있는 집!",
                      detail: "조용하고 좋아요.",
                      rating: 4,
                      createdAt: "2025-01-20T09:12:32.000Z",
                      storeName: "스타벅스 강남점"
                    },
                    {
                      reviewId: 9,
                      title: "최고!",
                      detail: "친절한 직원!",
                      rating: 5,
                      createdAt: "2025-01-11T10:21:11.000Z",
                      storeName: "이디야 커피"
                    }
                  ]
                }
              }
            }
          }
        }
      }

      #swagger.responses[400] = {
        description: '잘못된 userId',
        content: {
          "application/json": {
            schema: {
              example: {
                resultType: "FAIL",
                error: {
                  errorCode: "U002",
                  reason: "userId는 숫자여야 합니다.",
                  data: null
                },
                success: null
              }
            }
          }
        }
      }
    */

  try {
    const { userId } = req.params;
    const reviews = await listUserReviews(Number(userId));
    res.success({
      message: "내가 작성한 리뷰 목록 조회 성공",
      data: responseFromUserReviews(reviews),
    });
  } catch (err) {
    next(err);
  }
};

export const handleListMyReviews = async (req, res, next) => {
  /*
    #swagger.tags = ['Review']
    #swagger.summary = '내 리뷰 조회 API'
    #swagger.description = '로그인한 사용자가 직접 작성한 리뷰 목록을 조회합니다.'

    #swagger.security = [{
      "cookieAuth": []
    }]

    #swagger.responses[200] = {
      description: "내 리뷰 조회 성공",
      content: {
        "application/json": {
          schema: {
            example: {
              resultType: "SUCCESS",
              error: null,
              success: {
                message: "내 리뷰 조회 성공",
                data: [
                  {
                    reviewId: 10,
                    title: "맛있는 집!",
                    detail: "정말 음식이 깔끔했어요.",
                    rating: 4.5,
                    createdAt: "2025-01-20T09:12:32.000Z",
                    storeName: "스타벅스 강남점"
                  },
                  {
                    reviewId: 9,
                    title: "최고!",
                    detail: "직원들이 정말 친절합니다.",
                    rating: 5,
                    createdAt: "2025-01-11T10:21:11.000Z",
                    storeName: "투썸플레이스 강남점"
                  }
                ]
              }
            }
          }
        }
      }
    }

    #swagger.responses[401] = {
      description: "로그인 필요",
      content: {
        "application/json": {
          schema: {
            example: {
              resultType: "FAIL",
              error: {
                errorCode: "AUTH001",
                reason: "로그인이 필요합니다.",
                data: null
              },
              success: null
            }
          }
        }
      }
    }

    #swagger.responses[500] = {
      description: "서버 내부 오류",
      content: {
        "application/json": {
          schema: {
            example: {
              resultType: "FAIL",
              error: {
                errorCode: "unknown",
                reason: "내 리뷰 목록 조회 중 오류가 발생했습니다.",
                data: null
              },
              success: null
            }
          }
        }
      }
    }
  */
 
  try {
    const userId = req.user?.id;

    const reviews = await listMyReviews(userId);

    res.success({
      message: "내 리뷰 조회 성공",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};