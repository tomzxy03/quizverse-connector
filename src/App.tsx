import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import QuizLibrary from "./pages/QuizLibrary";
import Groups from "./pages/Groups";
import AddQuiz from "./pages/AddQuiz";
import ExamHistory from "./pages/ExamHistory";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import QuizDetail from "./pages/QuizDetail";
import { HomeOrDashboard } from "./components/HomeOrDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeOrDashboard />} />
            <Route path="/library" element={<QuizLibrary />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <Groups />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups/add-quiz"
              element={
                <ProtectedRoute>
                  <AddQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <ExamHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:id"
              element={
                <ProtectedRoute>
                  <QuizDetail />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
