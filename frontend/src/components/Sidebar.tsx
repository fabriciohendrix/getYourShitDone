import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

import api from "../api";

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [creating, setCreating] = useState(false);
  const [boards, setBoards] = useState<any[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch boards for the logged-in user
  const fetchBoards = async () => {
    setLoadingBoards(true);
    try {
      const res = await api.get("boards");
      setBoards(res.data || []);
    } catch (err) {
      setBoards([]);
    } finally {
      setLoadingBoards(false);
    }
  };

  // Create a new board
  const handleCreateBoard = async () => {
    console.log("handleCreateBoard called", newBoardName);
    if (!newBoardName.trim()) return;
    setCreating(true);
    try {
      console.log("Before api.post");
      const res = await api.post("boards", { name: newBoardName });
      console.log("api.post success", res);
      setNewBoardName("");
      setShowCreate(false);
      fetchBoards();
      // Navigate to the new board
      const slug = encodeURIComponent(newBoardName.toLowerCase());
      navigate(`/board/${slug}`);
    } catch (err: any) {
      console.error("Error in api.post", err);
      toast.error(
        err?.response?.data?.error?.message ||
          err?.response?.data?.error ||
          "Error creating board",
      );
    } finally {
      setCreating(false);
    }
  };

  // Fetch boards on mount
  React.useEffect(() => {
    fetchBoards();
    // eslint-disable-next-line
  }, []);

  return (
    <aside className="fixed left-6 top-6 bottom-6 z-40 w-64 max-w-[272px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col py-4 px-2.5 font-sans">
      {/* Logo/Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
          {/* SVG icon reduced by 10% */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_iii_3058_50905)">
              <g clipPath="url(#clip0_3058_50905)">
                <rect width="48" height="48" rx="12" fill="#5B21B6" />
              </g>
            </g>
          </svg>
        </div>
        <span
          className="font-semibold text-xl text-gray-900 tracking-tight"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Prio Tasks
        </span>
      </div>
      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          <li className="flex items-center justify-between px-3 py-2">
            <span className="font-medium text-[15px] text-gray-700">
              Boards <span className="text-lg">→</span>
            </span>
            <button
              className="ml-2 px-2 py-1 rounded bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100 hover:bg-primary-100 transition"
              onClick={() => setShowCreate(true)}
              title="Create new board"
            >
              + Novo
            </button>
          </li>
          {loadingBoards ? (
            <li className="px-3 py-2 text-gray-400 text-sm">Loading...</li>
          ) : boards.length === 0 ? (
            <li className="px-3 py-2 text-gray-400 text-sm">No boards</li>
          ) : (
            boards.map((board) => {
              const slug = encodeURIComponent(board.name.toLowerCase());
              return (
                <li key={board.id} className="px-3 py-2">
                  <NavLink
                    to={`/board/${slug}`}
                    className={({ isActive }) =>
                      `block rounded px-2 py-1 font-medium text-sm transition ${
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    {board.name}
                  </NavLink>
                </li>
              );
            })
          )}
        </ul>
      </nav>
      {/* Board creation popup */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xs border border-gray-100 relative">
            <button
              type="button"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition shadow-sm"
              aria-label="Close modal"
              onClick={() => setShowCreate(false)}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                <path
                  d="M6 6l6 6M12 6l-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="text-gray-900 text-lg font-semibold mb-4">
              Create new board
            </div>
            <input
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm placeholder-gray-400 transition mb-4"
              placeholder="Board name"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              autoFocus
              disabled={creating}
            />
            <button
              className="w-full px-4 py-2 rounded-[8px] border border-[#6941C6] bg-[#6941C6] text-white font-semibold shadow-sm hover:bg-[#53389E] focus:outline-none focus:ring-2 focus:ring-[#6941C6]/40 transition"
              onClick={handleCreateBoard}
              disabled={creating || !newBoardName.trim()}
            >
              {creating ? "Creating..." : "Create board"}
            </button>
          </div>
        </div>
      )}
      {/* User info bottom card with popover */}
      <div className="mt-8 flex flex-col gap-2 px-1 relative select-none">
        <div
          ref={avatarRef}
          className="flex items-center gap-4 p-2 rounded-2xl border border-gray-200 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition min-w-0"
          tabIndex={0}
          onClick={() => setPopoverOpen((v) => !v)}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="14" cy="14" r="12" fill="#E0E7FF" />
                <text
                  x="14"
                  y="19"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#7C3AED"
                >
                  {user?.name?.[0] || "U"}
                </text>
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate text-sm">
              {user?.name}
            </div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
        </div>
        {popoverOpen && (
          <div
            ref={popoverRef}
            className="absolute left-0 right-0 bottom-16 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 flex flex-col gap-2 animate-fade-in"
            style={{ minWidth: 220 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div
                  className="font-medium text-gray-900 text-sm truncate"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {user?.name || user?.email}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                logout();
              }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                <path
                  d="M11.25 6.75L13.5 9m0 0l-2.25 2.25M13.5 9H7.5m-3 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
