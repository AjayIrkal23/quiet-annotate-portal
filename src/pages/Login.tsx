// Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  getUser as fetchUserProfile,
} from "../store/thunks/userThunks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AppDispatch, RootState } from "@/store/store";
import RegisterDialog from "@/components/login/RegisterDialog";

const Login = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.user);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Fetch user profile if token exists in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedEmployeeId = localStorage.getItem("employeeId");
    if (token && storedEmployeeId) {
      dispatch(fetchUserProfile(storedEmployeeId));
    }
  }, [dispatch]);

  // Redirect if user profile is loaded and has jwtoken
  useEffect(() => {
    if (profile?.jwtoken) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", profile.role || "");
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [profile, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!employeeId.trim() || !password.trim()) {
      setError("Please enter employee ID and password");
      return;
    }
    try {
      const resultAction = await dispatch(loginUser({ employeeId, password }));
      if (loginUser.rejected.match(resultAction)) {
        setError((resultAction.payload as string) || "Login failed");
      } else if (loginUser.fulfilled.match(resultAction)) {
        localStorage.setItem("token", resultAction.payload.token);
        localStorage.setItem("employeeId", employeeId);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="">
              <img
                src="/lovable-uploads/a3da82cf-d79a-4c6d-ba7f-5a33302171b2.png"
                alt="ROKO TOKO Logo"
                className="w-14 h-14 rounded-full"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="employeeId"
                className="text-sm font-medium text-gray-300"
              >
                Employee ID
              </label>
              <Input
                id="employeeId"
                type="text"
                placeholder="Enter employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-pink-500 hover:from-emerald-600 hover:to-pink-600 text-white font-semibold"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-gray-400 mt-4">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="text-emerald-400 p-0"
              onClick={() => setIsRegisterOpen(true)}
            >
              Register Now
            </Button>
          </p>
        </CardContent>
      </Card>

      <RegisterDialog
        isOpen={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
      />
    </div>
  );
};

export default Login;
