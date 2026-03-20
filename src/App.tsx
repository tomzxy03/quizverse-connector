import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, QuizAttemptProvider } from "@/contexts";
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
import QuizTakingPage from "./pages/QuizTaking";
import QuizResultPage from "./pages/QuizResult";
import QuestionBankPage from "./pages/QuestionBank";
import ApiDocs from "./pages/ApiDocs";
import Profile from "./pages/Profile";
import HistoryResultDetail from "./pages/HistoryResultDetail";
import { HomeOrDashboard } from "./components/HomeOrDashboard";
import GroupLayout from "./components/group/GroupLayout";
import { GroupAnnouncementsTab, GroupQuizzesTab, GroupMembersTab, GroupSharedTab } from "./components/group/tabs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <QuizAttemptProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeOrDashboard />} />
              <Route path="/library" element={<QuizLibrary />} />
              <Route path="library/:subjectId" element={<QuizLibrary />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route
                path="/question-bank"
                element={
                  <ProtectedRoute>
                    <QuestionBankPage />
                  </ProtectedRoute>
                }
              />
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
                path="/groups/:groupId"
                element={
                  <ProtectedRoute>
                    <Groups />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groups/:groupId/:tab"
                element={
                  <ProtectedRoute>
                    <Groups />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groups/:groupId/add-quiz"
                element={
                  <ProtectedRoute>
                    <AddQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
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
                path="/history/:attemptId"
                element={
                  <ProtectedRoute>
                    <HistoryResultDetail />
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
              <Route
                path="/quiz/:id/take/:instanceId"
                element={
                  <ProtectedRoute>
                    <QuizTakingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:id/result/:instanceId"
                element={
                  <ProtectedRoute>
                    <QuizResultPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QuizAttemptProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
