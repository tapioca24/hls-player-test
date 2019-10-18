import QBiCAPI from "@/QBiCAPI";

const getObject = <T>(key: string) => {
  const str = localStorage.getItem(key);
  if (!str) {
    return null;
  }
  return JSON.parse(str) as T;
};

const setObject = <T>(key: string, obj: T) => {
  const str = JSON.stringify(obj);
  localStorage.setItem(key, str);
};

const removeObject = (key: string) => {
  localStorage.removeItem(key);
};

const tokensKey = "tokens";

const storeTokens = (tokens: QBiCAPI.Tokens) => {
  setObject(tokensKey, tokens);
};

const restoreTokens = () => {
  return getObject<QBiCAPI.Tokens>(tokensKey);
};

const removeTokens = () => {
  removeObject(tokensKey);
};

export default {
  storeTokens,
  restoreTokens,
  removeTokens
};
