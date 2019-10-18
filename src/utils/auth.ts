import { DateTime } from "luxon";
import router from "@/router";
import QBiCAPI from "@/QBiCAPI";
import authModule from "@/store/modules/auth";
import cameraModule from "@/store/modules/camera";

const isValidToken = (tokens: QBiCAPI.Tokens) => {
  const now = DateTime.local().toMillis();
  return now < tokens.expiresIn;
};

/**
 * アクセストークンを取得する
 */
const getAccessToken = async () => {
  try {
    if (!authModule.isLoggedIn) {
      throw new Error("Not signed in");
    }
    let tokens = authModule.tokens!;
    if (isValidToken(tokens)) {
      return tokens.accessToken;
    }
    await authModule.refresh();
    tokens = authModule.tokens!;
    return tokens.accessToken;
  } catch (err) {
    // 取得に失敗したらログアウトする
    logout();
    throw err;
  }
};

const logout = async () => {
  await authModule.logout();
  cameraModule.clearCameras();
  router.push({ name: "login" });
};

export default {
  isValidToken,
  getAccessToken,
  logout
};
