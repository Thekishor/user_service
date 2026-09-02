import axiosConfig, { API_ENDPOINTS } from "./axiosConfig";

export const registerUser = async (data) => {
    const {fullName, email, phone, password} = data;
    const response = await axiosConfig.post(
        API_ENDPOINTS.REGISTER,
        {fullName, email, phone, password}
    );
    return response;
}

export const loginUser = async (data) => {
    const {identifier, password} = data;
    return await axiosConfig.post(
        API_ENDPOINTS.LOGIN,
        {identifier, password}
    );
}

export const forgotPassword = async (data) => {
    const {email} = data;
    return await axiosConfig.post(
        API_ENDPOINTS.FORGOT_PASSWORD,
        {email}
    )
}

export const verifyEmail = async (token) => {
    return await axiosConfig.get(
        API_ENDPOINTS.VERIFY_EMAIL + `?token=${encodeURIComponent(token)}`
    )
}

export const refreshToken = async () => {
    return await axiosConfig.post(
        API_ENDPOINTS.REFRESH_TOKEN,
    )
}

export const changePassword = async (data) => {
    const {oldPassword, newPassword, confirmPassword} = data;
    return await axiosConfig.post(
        API_ENDPOINTS.CHANGE_PASSWORD,
        {oldPassword, newPassword, confirmPassword},
    )
}

export const resetPassword = async (token, data) => {
    const {newPassword, confirmPassword} = data;
    return await axiosConfig.post(
        API_ENDPOINTS.RESET_PASSWORD + `?token=${encodeURIComponent(token)}`,
        {newPassword, confirmPassword}
    )
}

export const logoutUser = async () => {
    return await axiosConfig.post(
        API_ENDPOINTS.LOGOUT,
        {},
    )
}

export const logoutUserFromAllDevices = async () => {
    return await axiosConfig.post(
        API_ENDPOINTS.LOGOUT_ALL,
        {},
    )
}

export const getUserAuditLogs = async () => {
    return await axiosConfig.get(
        API_ENDPOINTS.AUDIT_LOGS,
        {},
    )
}

export const profileUpdate = async (data) => {
    return await axiosConfig.put(
        API_ENDPOINTS.PROFILE,
        data
    );
}