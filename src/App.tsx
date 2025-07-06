
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Navigation from "./components/Navigation";
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

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/upload" element={<Upload />} />
                          <Route path="/annotation" element={<Annotation />} />
                          <Route
                            path="/leaderboard"
                            element={<Leaderboard />}
                          />
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
