import axios, { AxiosError } from "axios";
import httpStatus from "http-status";

import { loadConfigs } from "@/configs";
import { getBearerToken, removeBearerToken } from "@/helpers";

import { parseApiError } from "./error";

const configs = loadConfigs();

const api = axios.create({
  baseURL: configs.app.apiBaseUrl
});

api.interceptors.request.use((config) => {
  const accessToken = getBearerToken();
  config.headers.Authorization = `Bearer ${accessToken}`;
  config.headers["Access-Control-Allow-Origin"] = "*";
  config.headers["X-TIMEZONE"] = -new Date().getTimezoneOffset() / 60;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    if (error instanceof AxiosError && error.status == httpStatus.UNAUTHORIZED)
      removeBearerToken();
    const errorMessage = parseApiError(error);
    return Promise.reject(errorMessage);
  }
);

export { api };
