import Sidebar from "./components/Sidebar";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import TasksBoard from "./pages/TasksBoard";
import { useParams } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

// Wrapper para passar boardSlug para TasksBoard
function BoardRouteWrapper() {
  const { boardSlug } = useParams();
  return <TasksBoard boardSlug={boardSlug} />;
}

const App = () => {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pl-[288px]">
        {user && <Sidebar />}
        <main className="min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TasksBoard boardSlug={undefined} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/board/:boardSlug"
              element={
                <ProtectedRoute>
                  <BoardRouteWrapper />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
