import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserRole } from "../store/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      const storedRole = localStorage.getItem("userRole");
      if (storedRole) {
        dispatch(setUserRole(storedRole));
      }
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [navigate, location, dispatch]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login - accepts any username/password
    if (username.trim() && password.trim() && role) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("userRole", role);

      // Set role in Redux state
      dispatch(setUserRole(role));

      // Redirect to the page they were trying to access, or dashboard
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
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
            Enter credentials and select your role to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <div className="space-y-2">
              <label
                htmlFor="role"
                className="text-sm font-medium text-gray-300"
              >
                Role
              </label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem
                    value="admin"
                    className="text-white hover:bg-gray-600"
                  >
                    Admin
                  </SelectItem>
                  <SelectItem
                    value="user"
                    className="text-white hover:bg-gray-600"
                  >
                    User
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-pink-500 hover:from-emerald-600 hover:to-pink-600 text-white font-semibold"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
