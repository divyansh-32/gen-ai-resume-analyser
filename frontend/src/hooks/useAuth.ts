import { useEffect } from "react";
import {getCurrentUser, loginUser, logoutUser, registerUser} from "../services/auth";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router";
import { useResumeAnalysisStore } from "@/store/resumeAnalysis";
interface User {
  id?: number;
  email: string;
  password?: string;
  username?: string;
}

export function useAuth() {
  const { setUser: setAuthUser, isAuthenticated, user, logout: logoutZus } = useAuthStore();
  const { resetUploadState } = useResumeAnalysisStore();
//   const [userData, setUserData] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated on component mount
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        if (response.data.user) {
          setAuthUser(response.data.user);
        //   setUserData(response.data.user);
          // navigate("/");
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };
    checkAuth();
  }, []);

  const login = async (userData: User) => {
    try {
        const response = await loginUser({ email: userData.email, password: userData.password });
        const userInfo = response.data.user;
        setAuthUser(userInfo);
        // setUserData(userInfo);
        if(userInfo) {
            navigate("/");
        }
    } catch(err) {
        console.log(err);
    }
  };

  const logout = async () => {
    await logoutUser();
    // setUserData(null);
    logoutZus();
    resetUploadState();
    navigate('/login');
  };

  const registerMethod = async (userData: User) => {
    try {
        const response = await registerUser({ email: userData.email, 
            password: userData.password, 
            name: userData.username });
        const userInfo = response.data.user;
        setAuthUser(userInfo);
        if (isAuthenticated) {
            navigate("/");
        }
    } catch(err) {
        console.log(err);
    }
  }

  return { user, login, logout, registerMethod };
}

