// src/components/Header.tsx
import { useNavigate, useLocation } from "react-router";
import { DropdownMenuDemo } from "./ProfileDropdown";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Home", path: "/" },
    { label: "Your Resumes", path: "/your-resumes" },
    { label: "Templates", path: "/templates" },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md sticky top-0 z-[100] backdrop-blur-md bg-blue-600/95">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Left Section */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <h1
            className="text-2xl font-semibold tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            ResumeBuilder
          </h1>

          {/* Tabs */}
          <nav className="hidden md:flex items-center gap-3">
            {tabs.map((tab) => {
              const active = location.pathname === tab.path;
          
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-white/20 backdrop-blur-md"
                      : "hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section */}
        <DropdownMenuDemo />
      </div>
    </header>
  );
}