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
import { useNavigate } from "react-router-dom";
import { clearToken, setToken } from "../services/token.manager";
import { setAuthExpiredHandler } from "../services/axios.interceptors";
import { authChannel } from "../services/authChannel";

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
        console.log(response.data.user);
      } catch {
        setUser(null);
        clearToken();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // event listener setup
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "LOGOUT") {
        setUser(null);
        clearToken();
        navigate("/login");
      }
    };

    // wait for a message from another tab
    authChannel.addEventListener("message", handleMessage);

    return () => {
      // removes listener during cleanup
      authChannel.removeEventListener("message", handleMessage);
    };
  });

  setAuthExpiredHandler(() => {
    setUser(null);
    clearToken();
    navigate("/login");
  });

  // logout single devices
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      // call token manager.js
      clearToken();

      //tell others tabs
      authChannel.postMessage({
        type: "LOGOUT",
      });

      navigate("/login");
    }
  }, [navigate]);

  // logout all devices
  const logoutAll = useCallback(async () => {
    try {
      await logoutUserFromAllDevices();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      // call token manager.js
      clearToken();
      navigate("/login");
    }
  }, [navigate]);

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
