import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight, Settings01, LogOut01, Plus, X } from "@untitledui/icons";
import { useAuth } from "../hooks/useAuth";
import api from "../api";
import BrandLogo from "./BrandLogo";
import CreateBoardModal from "./CreateBoardModal";
import { Button } from "@/components/base/buttons/button";
import { Avatar } from "@/components/base/avatar/avatar";
import { cx } from "@/utils/cx";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { user, logout } = useAuth();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [boards, setBoards] = useState<any[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [taskCounts, setTaskCounts] = useState<Record<number, number>>({});
  const popoverRef = useRef<HTMLDivElement>(null);

  const fetchBoards = async () => {
    setLoadingBoards(true);
    try {
      const res = await api.get("boards");
      setBoards(res.data || []);
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
    } catch {
      setBoards([]);
    } finally {
      setLoadingBoards(false);
    }
  };

  const getBoardColor = (board: any) => {
    if (board.color) return board.color;
    const colors = ["bg-purple-500", "bg-blue-500", "bg-pink-500", "bg-green-500", "bg-orange-500", "bg-red-500", "bg-indigo-500", "bg-cyan-500"];
    return colors[board.id % colors.length];
  };

  React.useEffect(() => { fetchBoards(); }, []);

  React.useEffect(() => {
    if (!popoverOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [popoverOpen]);

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {onClose && (
        <div
          className={cx(
            "fixed inset-0 z-30 bg-overlay/50 backdrop-blur-sm transition-opacity md:hidden",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cx(
          "fixed top-0 bottom-0 left-0 z-40 flex w-72 flex-col bg-primary shadow-xl ring-1 ring-primary transition-transform duration-300",
          "md:top-6 md:bottom-6 md:left-6 md:w-64 md:rounded-2xl md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-2.5 px-5 pt-5 pb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <BrandLogo className="h-9 w-9 shrink-0" />
            <span className="font-semibold text-md text-primary tracking-tight truncate">#getYourShitDone</span>
          </div>
          {onClose && (
            <Button color="tertiary" size="xs" iconLeading={X} onClick={onClose} className="md:hidden shrink-0" aria-label="Close sidebar" />
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-3">
          <div className="mb-2">
            <div className="flex items-center justify-between px-3 py-1.5 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-quaternary">Your Boards</span>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded px-1 text-xs font-semibold text-quaternary ring-1 ring-primary">
                {boards.length}
              </span>
            </div>

            <div className="px-1 mb-2">
              <Button color="tertiary" size="xs" iconLeading={Plus} className="w-full justify-start" onClick={() => setShowCreate(true)}>
                New Board
              </Button>
            </div>

            <ul className="space-y-0.5">
              {loadingBoards ? (
                <li className="px-3 py-2 text-sm text-tertiary">Loading...</li>
              ) : boards.length === 0 ? (
                <li className="px-3 py-2 text-sm text-tertiary">No boards yet</li>
              ) : (
                boards.map((board) => {
                  const slug = board.name.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <li key={board.id}>
                      <NavLink
                        to={`/board/${slug}`}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          cx(
                            "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive ? "bg-active text-primary" : "text-secondary hover:bg-primary_hover hover:text-primary",
                          )
                        }
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className={`h-2 w-2 shrink-0 rounded-full ${getBoardColor(board)}`} />
                          <span className="truncate">{board.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded px-1 text-xs font-semibold text-quaternary ring-1 ring-primary">
                            {taskCounts[board.id] || 0}
                          </span>
                          <ChevronRight className="size-3.5 text-quaternary" />
                        </div>
                      </NavLink>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          <div className="my-2 h-px bg-secondary" />

          <ul className="space-y-0.5">
            <li>
              <NavLink
                to="/profile"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cx(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-active text-primary" : "text-secondary hover:bg-primary_hover hover:text-primary",
                  )
                }
              >
                <Settings01 className="size-4 shrink-0 text-quaternary" />
                Profile
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* User card */}
        <div className="relative px-3 pb-4">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-primary hover:bg-primary_hover transition-colors text-left"
            onClick={() => setPopoverOpen((v) => !v)}
          >
            <Avatar size="sm" initials={user?.name?.[0]?.toUpperCase() || "U"} src={null} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-primary truncate">{user?.name}</div>
              <div className="text-xs text-tertiary truncate">{user?.email}</div>
            </div>
          </button>

          {popoverOpen && (
            <div
              ref={popoverRef}
              className="absolute left-3 right-3 bottom-full mb-2 z-50 rounded-xl bg-primary shadow-lg ring-1 ring-primary p-1.5"
            >
              <button
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-error-primary hover:bg-error-primary transition-colors"
                onClick={(e) => { e.preventDefault(); logout(); }}
              >
                <LogOut01 className="size-4 shrink-0" />
                Logout
              </button>
            </div>
          )}
        </div>

        <CreateBoardModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={fetchBoards}
        />
      </aside>
    </>
  );
};

export default Sidebar;
