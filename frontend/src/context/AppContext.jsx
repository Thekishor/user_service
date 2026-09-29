import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  logoutUser,
  logoutUserFromAllDevices,
  refreshToken,
} from "../services/authService";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { clearToken, getToken, setToken } from "../services/token.manager";
import { setAuthExpiredHandler } from "../services/axios.interceptors";
import { authChannel } from "../services/authChannel";
import { toast } from "sonner";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await refreshToken();
        const token = response.data.token;

        // call token manager.js
        setToken(token);
        setUser(response.data.user);
      } catch {
        setUser(null);
        clearToken();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    clearToken();
    navigate("/login");
  }, [navigate]);

  // event listener setup
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "LOGOUT") {
        clearAuth();
      }
    };

    // wait for a message from another tab
    authChannel.addEventListener("message", handleMessage);

    return () => {
      // removes listener during cleanup
      authChannel.removeEventListener("message", handleMessage);
    };
  });

  useEffect(() => {
    setAuthExpiredHandler(() => {
      setUser(null);
      clearToken();
      navigate("/login");
    });
  }, [navigate]);

  // logout single devices
  const logout = useCallback(async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuth();

      authChannel.postMessage({
        type: "LOGOUT",
      });
    }
  }, [clearAuth]);

  // logout all devices
  const logoutAll = useCallback(async () => {
    try {
      await logoutUserFromAllDevices();
      toast.success("Logged out from all devices successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  //socket.io logout from all devices
  useEffect(() => {
    const token = getToken();

    if (!token) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("logout-all", () => {
      console.log("Received LOGOUT-ALL event");

      clearAuth();
    });

    return () => {
      socket.disconnect();
    };
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      logout,
      logoutAll,
    }),
    [user, loading, logout, logoutAll],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAuth = () => {
  return useContext(AppContext);
};
