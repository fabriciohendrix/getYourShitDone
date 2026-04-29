import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Menu01 } from "@untitledui/icons";
import Sidebar from "./components/Sidebar";
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

function BoardRouteWrapper() {
  const { boardSlug } = useParams();
  return <TasksBoard boardSlug={boardSlug} />;
}

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary">
      {user && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Mobile top bar */}
      {user && (
        <div className="fixed top-0 left-0 right-0 z-20 flex items-center gap-3 bg-primary px-4 py-3 shadow-xs ring-1 ring-primary md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center rounded-lg p-1.5 text-secondary hover:bg-primary_hover transition-colors"
            aria-label="Open menu"
          >
            <Menu01 className="size-5" />
          </button>
          <span className="font-semibold text-sm text-primary">#getYourShitDone</span>
        </div>
      )}

      <main className={user ? "md:pl-[288px] pt-14 md:pt-0" : ""}>
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout>
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
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
