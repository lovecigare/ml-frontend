import { loadConfigs } from "@/configs";
const configs = loadConfigs();

const getBearerToken = (): string => {
  if (window && window.localStorage) {
    const token = window.localStorage.getItem(configs.auth.authBearerTokenKey);
    return token || "";
  }
  return "";
};

const setBearerToken = (token: string) => {
  if (window && window.localStorage) {
    window.localStorage.setItem(configs.auth.authBearerTokenKey, token);
  }
};

const removeBearerToken = () => {
  if (window && window.localStorage) {
    window.localStorage.removeItem(configs.auth.authBearerTokenKey);
  }
};

export { getBearerToken, removeBearerToken,setBearerToken };
