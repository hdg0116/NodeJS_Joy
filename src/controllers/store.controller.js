import { listStoreReviews } from "../services/store.service.js";

export const handleListStoreReviews = async (req, res, next) => {
/*
  #swagger.summary = '가게별 올라온 리뷰 조회 API';
  #swagger.description = '특정 가게의 리뷰 목록을 조회합니다.';
  #swagger.tags = ['Store']

  #swagger.parameters['storeId'] = {
    in: 'path',
    description: '리뷰를 조회할 가게 ID',
    required: true,
    type: 'integer',
    example: 1
  }

  #swagger.parameters['cursor'] = {
    in: 'query',
    description: '다음 페이지 조회를 위한 커서 값',
    required: false,
    type: 'integer',
    example: 0
  }

  #swagger.responses[200] = {
    description: '스토어 리뷰 조회 성공 응답',
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              properties: {
                message: { type: "string", example: "스토어 리뷰 조회 성공" },
                data: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "number", example: 13 },
                          detail: { type: "string", example: "리뷰 내용" },
                          rating: { type: "number", example: 4.5 },
                          store: {
                            type: "object",
                            properties: {
                              id: { type: "number", example: 1 },
                              name: { type: "string", example: "맛있는 식당" }
                            }
                          }
                        }
                      }
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        cursor: { type: "number", nullable: true, example: 20 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
*/

  try {
    const reviews = await listStoreReviews(
      parseInt(req.params.storeId),
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.success({
      message: "스토어 리뷰 조회 성공",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};