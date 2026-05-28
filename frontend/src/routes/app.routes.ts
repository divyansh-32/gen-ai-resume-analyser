import {createBrowserRouter} from "react-router";
import Home from "../features/resumeCheck/pages/Home";
import login from "../features/auth/pages/login";
import SignUp from "../features/auth/pages/signUp";
import YourResume from "@/features/yourResumes/pages/yourResume";
// import ResumeAnalysisPage from "@/features/resumeCheck/pages/resumeAnalysis";

const router = createBrowserRouter([
    {
        path: "/",
        Component:  Home,
    },
    {
        path: "/login",
        Component: login,
    },
    {
        path: "/register",
        Component: SignUp,
    },
    {
        path: "/your-resumes",
        Component: YourResume,
    }
]);

export default router;