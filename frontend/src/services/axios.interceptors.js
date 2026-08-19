import { refreshToken } from "./authService";
import axiosConfig from "./axiosConfig";
import { clearToken, getToken, setToken } from "./token.manager";

const publicEndpoints = [
  "/auth/register",
  "/auth/login",
  "/auth/verify-email",
  "/auth/refresh-token",
  "/auth/forgot-password",
  "/auth/reset-password",
];

//req interceptors
axiosConfig.interceptors.request.use(
  (config) => {
    const token = getToken();

    const shouldSkipToken = publicEndpoints.some((endPoint) => {
      return config.url?.includes(endPoint);
    });

    if (!shouldSkipToken && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

//res interceptors

let onAuthExpired = null;

export const setAuthExpiredHandler = (handler) => {
    onAuthExpired = handler;
}

axiosConfig.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = publicEndpoints.some((endPoint) =>
      originalRequest.url?.includes(endPoint),
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const res = await refreshToken();

        const { token } = res.data;

        // set to token manager.js
        setToken(token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosConfig(originalRequest);
      } catch (error) {
        clearToken();

        if (onAuthExpired) {
          onAuthExpired();
        }

        throw error;
      }
    }
    throw error;
  }
);
