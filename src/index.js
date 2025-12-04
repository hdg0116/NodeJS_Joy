import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { handleUpdateUserInfo, handleUserSignUp } from "./controllers/user.controller.js";
import { handleAddReview, handleListMyReviews, handleListUserReviews } from "./controllers/review.controller.js";
import { handleAddMission, handleCompleteUserMission, handleListStoreMissions, handleListUserMissions } from "./controllers/mission.controller.js";
import { handleStartUserMission } from "./controllers/userMission.controller.js";
import { handleListStoreReviews } from "./controllers/store.controller.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { googleStrategy, jwtStrategy } from "./auth.config.js";
import passport from "passport";

dotenv.config();
passport.use(googleStrategy);
passport.use(jwtStrategy); 
const app = express();
const port = process.env.PORT;

app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

app.use(morgan('dev'));  // 로그 포맷: dev
app.use(cookieParser());

app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/oauth2/login/google", 
  passport.authenticate("google", { 
    session: false 
  })
);
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
	  session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    const tokens = req.user; 

    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
          message: "Google 로그인 성공!",
          tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
      }
    });
  }
);

const isLogin = passport.authenticate('jwt', { session: false });

app.get('/mypage', isLogin, (req, res) => {
  res.status(200).success({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
});


app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(undefined, {
    swaggerOptions: { url: "/openapi.json" }
  })
);


app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = [
    "./src/index.js",
    "./src/controllers/*.js"
  ];
  const doc = {
    info: {
      title: "UMC 9th",
      description: "UMC 9th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.post("/users/signup", handleUserSignUp);
app.post("/stores/:storeId/reviews", isLogin, handleAddReview);
app.post("/stores/:storeId/missions", isLogin, handleAddMission);
app.post("/missions/:missionId/start", isLogin, handleStartUserMission);

app.get("/stores/:storeId/reviews", isLogin, handleListStoreReviews);
app.get("/users/:userId/reviews", isLogin, handleListUserReviews);
app.get("/stores/:storeId/missions", isLogin, handleListStoreMissions);
app.get("/users/:userId/missions", isLogin, handleListUserMissions);
app.get("/reviews/me", isLogin, handleListMyReviews);
app.get("/stores/:storeId/reviews", isLogin, handleListStoreReviews);

app.patch("/missions/:userMissionId/complete", isLogin, handleCompleteUserMission);
app.patch("/users/:userId", isLogin, handleUpdateUserInfo);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});