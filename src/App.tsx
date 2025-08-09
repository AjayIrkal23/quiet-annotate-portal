import { Toaster } from "@/components/ui/toaster";

import { Toaster as Sonner } from "@/components/ui/sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Provider, useSelector } from "react-redux";

import { store, RootState } from "./store/store";

import Navigation from "./components/general/Navigation";
import ResponsiveLayout from "./components/ResponsiveLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Annotation from "./pages/Annotation";
import Leaderboard from "./pages/Leaderboard";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

// Component to protect admin-only routes

const AdminOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const userRole = useSelector((state: RootState) => state.user.profile?.role);
  const fallbackRole = localStorage.getItem("userRole") || "user";
  const effectiveRole = userRole || fallbackRole;

  if (effectiveRole !== "admin") {
    return <Navigate to="/annotation" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const userRole = useSelector((state: RootState) => state.user.profile?.role);
  const fallbackRole = localStorage.getItem("userRole") || "user";
  const effectiveRole = userRole || fallbackRole;
  return (
    <ResponsiveLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full flex">
                <Navigation />
                <main className="flex-1 min-w-0">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        effectiveRole === "user" ? (
                          <Navigate to="/annotation" replace />
                        ) : (
                          <AdminOnlyRoute>
                            <Dashboard />
                          </AdminOnlyRoute>
                        )
                      }
                    />
                    <Route
                      path="/upload"
                      element={
                        <AdminOnlyRoute>
                          <Upload />
                        </AdminOnlyRoute>
                      }
                    />
                    <Route path="/annotation" element={<Annotation />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ResponsiveLayout>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
