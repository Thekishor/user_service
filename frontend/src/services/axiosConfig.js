import axios from "axios";

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Accept": "application/json",
    },
    withCredentials: true
});

export const API_ENDPOINTS = {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    REFRESH_TOKEN: "/api/v1/auth/refresh-token",
    VERIFY_EMAIL: "/api/v1/auth/verify-email",
    LOGOUT: "/api/v1/auth/logout",
    LOGOUT_ALL: "/api/v1/auth/logout-all",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    AUDIT_LOGS: "/api/v1/auth/audit-logs",
    PROFILE: "/api/v1/auth/profile",
    GET_ALL_USERS: "/api/v1/admin/users",
    DELETE_USER: "/api/v1/admin/users"
}

export default axiosConfig;