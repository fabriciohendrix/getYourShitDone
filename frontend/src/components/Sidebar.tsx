import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api";
import CreateBoardModal from "./CreateBoardModal";

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [boards, setBoards] = useState<any[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [taskCounts, setTaskCounts] = useState<Record<number, number>>({});
  const avatarRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Fetch boards for the logged-in user
  const fetchBoards = async () => {
    setLoadingBoards(true);
    try {
      const res = await api.get("boards");
      setBoards(res.data || []);

      // Fetch task counts for each board
      const counts: Record<number, number> = {};
      for (const board of res.data || []) {
        try {
          const tasksRes = await api.get(`tasks?board_id=${board.id}`);
          counts[board.id] = (tasksRes.data || []).length;
        } catch {
          counts[board.id] = 0;
        }
      }
      setTaskCounts(counts);
    } catch (err) {
      setBoards([]);
    } finally {
      setLoadingBoards(false);
    }
  };

  // Get board color from database or default
  const getBoardColor = (board: any) => {
    if (board.color) {
      return board.color;
    }
    // Fallback to ID-based color if no color in DB
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ];
    return colors[board.id % colors.length];
  };

  // Fetch boards on mount
  React.useEffect(() => {
    fetchBoards();
    // eslint-disable-next-line
  }, []);

  return (
    <aside className="fixed left-6 top-6 bottom-6 z-40 w-64 max-w-[272px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col p-4 font-sans">
      {/* Logo/Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 flex items-center justify-center shrink-0">
          <svg
            width="36"
            height="36"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g filter="url(#filter0_iii_3058_50905)">
              <g clipPath="url(#clip0_3058_50905)">
                <rect width="48" height="48" rx="12" fill="#5B21B6" />
                <rect
                  width="48"
                  height="48"
                  fill="url(#paint0_linear_3058_50905)"
                />
                <g filter="url(#filter1_d_3058_50905)">
                  <path
                    opacity="0.6"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.0833 9.75C12.5855 9.75 9.75 12.5855 9.75 16.0833V31.9167C9.75 35.4145 12.5855 38.25 16.0833 38.25H31.9167C35.4145 38.25 38.25 35.4145 38.25 31.9167V16.0833C38.25 12.5855 35.4145 9.75 31.9167 9.75H16.0833ZM16.0833 13.7083C14.7717 13.7083 13.7083 14.7717 13.7083 16.0833V31.9167C13.7083 33.2283 14.7717 34.2917 16.0833 34.2917H21.625C22.9367 34.2917 24 33.2283 24 31.9167V16.0833C24 14.7717 22.9367 13.7083 21.625 13.7083H16.0833Z"
                    fill="url(#paint1_linear_3058_50905)"
                  />
                </g>
              </g>
              <rect
                x="1"
                y="1"
                width="46"
                height="46"
                rx="11"
                stroke="url(#paint2_linear_3058_50905)"
                strokeWidth="2"
              />
            </g>
            <defs>
              <filter
                id="filter0_iii_3058_50905"
                x="0"
                y="-3"
                width="48"
                height="54"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="-3" />
                <feGaussianBlur stdDeviation="1.5" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_3058_50905"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="3" />
                <feGaussianBlur stdDeviation="1.5" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect1_innerShadow_3058_50905"
                  result="effect2_innerShadow_3058_50905"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feMorphology
                  radius="1"
                  operator="erode"
                  in="SourceAlpha"
                  result="effect3_innerShadow_3058_50905"
                />
                <feOffset />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect2_innerShadow_3058_50905"
                  result="effect3_innerShadow_3058_50905"
                />
              </filter>
              <filter
                id="filter1_d_3058_50905"
                x="6.75"
                y="4.25"
                width="34.5"
                height="44"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feMorphology
                  radius="1.5"
                  operator="erode"
                  in="SourceAlpha"
                  result="effect1_dropShadow_3058_50905"
                />
                <feOffset dy="2.25" />
                <feGaussianBlur stdDeviation="2.25" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_3058_50905"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_3058_50905"
                  result="shape"
                />
              </filter>
              <linearGradient
                id="paint0_linear_3058_50905"
                x1="24"
                y1="5.96047e-07"
                x2="26"
                y2="48"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.12" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_3058_50905"
                x1="24"
                y1="9.75"
                x2="24"
                y2="38.25"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" stopOpacity="0.8" />
                <stop offset="1" stopColor="white" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_3058_50905"
                x1="24"
                y1="0"
                x2="24"
                y2="48"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" stopOpacity="0.12" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <clipPath id="clip0_3058_50905">
                <rect width="48" height="48" rx="12" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <span
          className="font-semibold text-xl text-gray-900 tracking-tight"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          getYourShitDone
        </span>
      </div>
      {/* Navigation */}
      <nav className="flex-1 flex flex-col">
        <div className="flex-1">
          {/* Boards Section */}
          <div className="mb-8">
            <div className="px-3 py-2 mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Your Boards
              </span>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded border border-gray-300 bg-gray-50 text-xs font-semibold text-gray-700">
                {boards.length}
              </span>
            </div>
            <div className="px-3 py-2 mb-2">
              <button
                className="w-full px-2 py-1 rounded bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100 hover:bg-primary-100 transition"
                onClick={() => setShowCreate(true)}
                title="Create new board"
              >
                + New Board
              </button>
            </div>
            <ul className="space-y-1">
              {loadingBoards ? (
                <li className="px-3 py-2 text-gray-400 text-sm">Loading...</li>
              ) : boards.length === 0 ? (
                <li className="px-3 py-2 text-gray-400 text-sm">No boards</li>
              ) : (
                boards.map((board) => {
                  const slug = board.name.toLowerCase().replace(/\s+/g, "-");
                  const boardColor = getBoardColor(board);
                  return (
                    <li key={board.id} className="px-1">
                      <NavLink
                        to={`/board/${slug}`}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2 rounded-lg font-medium text-sm transition ${
                            isActive
                              ? "bg-primary-50 text-primary-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`
                        }
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className={`w-2 h-2 rounded-full ${boardColor} flex-shrink-0`}
                          />
                          <span className="truncate">{board.name}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="inline-flex items-center justify-center px-2 py-1 rounded border border-gray-300 bg-gray-50 text-xs font-semibold text-gray-700">
                            {taskCounts[board.id] || 0}
                          </span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="text-gray-400"
                          >
                            <path
                              d="M6 12l4-4-4-4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </NavLink>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-6" />

          {/* Settings Section */}
          <div>
            <div className="px-3 py-2 mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </span>
            </div>
            <ul className="space-y-1">
              <li className="px-1">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                    <path
                      d="M10 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1.25c-3.452 0-5 1.865-5 3.75v1.25h10v-1.25c0-1.885-1.548-3.75-5-3.75z"
                      fill="currentColor"
                    />
                  </svg>
                  Profile
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <CreateBoardModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={fetchBoards}
      />
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
