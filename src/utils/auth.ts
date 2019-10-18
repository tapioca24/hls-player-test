import { DateTime } from "luxon";
import router from "@/router";
import authModule from "@/store/modules/auth";
import QBiCAPI from "@/QBiCAPI";

const isValidToken = (tokens: QBiCAPI.Tokens) => {
  const now = DateTime.local().toMillis();
  return now < tokens.expiresIn;
};

const getAccessToken = async () => {
  if (!authModule.isLoggedIn) {
    return null;
  }
  const tokens = authModule.tokens!;
  if (isValidToken(tokens)) {
    return tokens.accessToken;
  }
  try {
    await authModule.refresh();
    return authModule.tokens;
  } catch (err) {
    return null;
  }
};

const logout = async () => {
  await authModule.logout();
  router.push({ name: "login" });
};

export default {
  isValidToken,
  getAccessToken,
  logout
};
