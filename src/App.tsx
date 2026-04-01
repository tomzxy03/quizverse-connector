import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, QuizAttemptProvider } from "@/contexts";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HomeOrDashboard } from "./components/HomeOrDashboard";

const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const QuizLibrary = lazy(() => import("./pages/QuizLibrary"));
const Groups = lazy(() => import("./pages/Groups"));
const AddQuiz = lazy(() => import("./pages/AddQuiz"));
const ExamHistory = lazy(() => import("./pages/ExamHistory"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const QuizDetail = lazy(() => import("./pages/QuizDetail"));
const QuizTakingPage = lazy(() => import("./pages/QuizTaking"));
const QuizResultPage = lazy(() => import("./pages/QuizResult"));
const QuestionBankPage = lazy(() => import("./pages/QuestionBank"));
const ApiDocs = lazy(() => import("./pages/ApiDocs"));
const Profile = lazy(() => import("./pages/Profile"));
const HistoryResultDetail = lazy(() => import("./pages/HistoryResultDetail"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <QuizAttemptProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<HomeOrDashboard />} />
                <Route path="/library" element={<QuizLibrary />} />
                <Route path="library/:subjectId" element={<QuizLibrary />} />
                <Route
                  path="/library/create"
                  element={
                    <ProtectedRoute requiredRoles={["HOST", "ADMIN"]}>
                      <AddQuiz />
                    </ProtectedRoute>
                  }
                />
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
                  path="/tomzxyadmin"
                  element={
                    <ProtectedRoute requiredRoles={["ADMIN"]}>
                      <AdminDashboard />
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
                  path="/groups/:groupId/quizzes/:id"
                  element={
                    <ProtectedRoute>
                      <QuizDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/groups/:groupId/quizzes/:id/submissions/:attemptId"
                  element={
                    <ProtectedRoute>
                      <HistoryResultDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/groups/:groupId/quizzes/:id/take/:instanceId"
                  element={
                    <ProtectedRoute>
                      <QuizTakingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/groups/:groupId/quizzes/:id/result/:instanceId"
                  element={
                    <ProtectedRoute>
                      <QuizResultPage />
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
                <Route path="/quiz/:id" element={<QuizDetail />} />
                <Route path="/quiz/:id/take/:instanceId" element={<QuizTakingPage />} />
                <Route path="/quiz/:id/result/:instanceId" element={<QuizResultPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QuizAttemptProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
