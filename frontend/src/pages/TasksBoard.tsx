import React, { useEffect, useState } from "react";
import api from "../api";
import { Task } from "../types";
import TaskFormModal from "../components/TaskFormModal";
import { ConfirmModal, ConfirmPriorityModal } from "../components/ConfirmModal";
import DroppableColumn from "../components/DroppableColumn";
import TaskCard from "../components/TaskCard";
import SortableAccordion from "../components/SortableAccordion";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import toast from "react-hot-toast";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

type ColumnType = "in_progress" | "backlog";

const columnNames = {
  in_progress: "In Progress",
  backlog: "Backlog",
};

const getBoardColor = (board: any) => {
  if (board?.color) return board.color;
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
  return colors[(board?.id ?? 0) % colors.length];
};

type TasksBoardProps = { boardSlug?: string };
const TasksBoard = ({ boardSlug }: TasksBoardProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [pendingPriorityChange, setPendingPriorityChange] = useState<null | {
    event: DragEndEvent;
    oldIndex: number;
    newIndex: number;
    sourceCol: ColumnType;
  }>(null);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [boardId, setBoardId] = useState<number | null>(null);
  const [board, setBoard] = useState<any>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);

  // Fetch boards from backend and select board by slug
  useEffect(() => {
    const fetchBoards = async () => {
      setLoadingBoards(true);
      try {
        const res = await api.get("boards");
        setBoards(res.data);
        if (boardSlug) {
          const found = res.data.find(
            (b: any) => b.name.toLowerCase().replace(/\s+/g, "-") === boardSlug,
          );
          setBoard(found || null);
          setBoardId(found ? found.id : null);
        } else {
          setBoard(null);
          setBoardId(null);
        }
      } catch {
        setBoards([]);
        setBoard(null);
        setBoardId(null);
      } finally {
        setLoadingBoards(false);
      }
    };
    fetchBoards();
  }, [boardSlug]);

  // DEBUG: shows boardSlug, board, boards

  // Fetch tasks from board
  const fetchTasks = async () => {
    if (!boardId) return;
    setLoading(true);
    try {
      const res = await api.get("tasks", {
        params: { board_id: boardId },
      });
      setTasks(res.data);
    } catch {
      toast.error("Error loading tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [boardId]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`tasks/${id}`);
      setTasks((t) => t.filter((task) => task.id !== id));
      toast.success("Task deleted!");
    } catch {
      toast.error("Error deleting task");
    }
  };

  // Drag-and-drop real
  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTaskId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Discover source column
    let sourceCol: ColumnType | null = null;
    let sourceTasks: Task[] = [];
    (["in_progress", "backlog"] as ColumnType[]).forEach((col) => {
      const ids = tasks.filter((t) => t.column === col).map((t) => t.id);
      if (ids.includes(active.id as string)) {
        sourceCol = col;
        sourceTasks = tasks.filter((t) => t.column === col);
      }
    });
    if (!sourceCol) return;

    // Discover destination column
    let destCol: ColumnType | null = null;
    let destTasks: Task[] = [];
    (["in_progress", "backlog"] as ColumnType[]).forEach((col) => {
      const ids = tasks.filter((t) => t.column === col).map((t) => t.id);
      if (ids.includes(over.id as string)) {
        destCol = col;
        destTasks = tasks.filter((t) => t.column === col);
      }
    });
    if (!destCol && (over.id === "in_progress" || over.id === "backlog")) {
      destCol = over.id as ColumnType;
      destTasks = tasks.filter((t) => t.column === destCol);
    }
    if (!destCol) return;

    const oldIndex = sourceTasks.findIndex((t) => t.id === active.id);
    let newIndex = destTasks.findIndex((t) => t.id === over.id);

    // If reorder within the same column (priority change)
    if (sourceCol === destCol && oldIndex !== newIndex && newIndex !== -1) {
      setPendingPriorityChange({ event, oldIndex, newIndex, sourceCol });
      setShowPriorityModal(true);
      return;
    }

    // Normal case (column change or drop zone)
    await doDrag(
      event,
      oldIndex,
      newIndex,
      sourceCol,
      destCol,
      sourceTasks,
      destTasks,
    );
  };

  // Helper function to perform drag
  const doDrag = async (
    event: DragEndEvent,
    oldIndex: number,
    newIndex: number,
    sourceCol: ColumnType,
    destCol: ColumnType,
    sourceTasks: Task[],
    destTasks: Task[],
  ) => {
    const { active, over } = event;
    let newTasks = [...tasks];
    // If moved across columns
    if (sourceCol !== destCol) {
      if (sourceCol === "backlog" && destCol !== "backlog") {
        newIndex = destTasks.length;
      } else if (newIndex === -1) {
        newIndex = destTasks.length;
      }
      newTasks = newTasks.map((t) =>
        t.id === active.id ? { ...t, column: destCol!, position: newIndex } : t,
      );
      let i = 0;
      newTasks = newTasks.map((t) => {
        if (t.column === sourceCol && t.id !== active.id) {
          return { ...t, position: i++ };
        }
        return t;
      });
    } else {
      if (newIndex === -1) newIndex = destTasks.length;
      const reordered = arrayMove(sourceTasks, oldIndex, newIndex);
      let i = 0;
      newTasks = newTasks.map((t) => {
        if (t.column === sourceCol) {
          const reorderedTask = reordered[i++];
          return { ...reorderedTask, position: i - 1 };
        }
        return t;
      });
    }
    setTasks(newTasks);
    const movedTask = newTasks.find((t) => t.id === active.id);
    if (movedTask) {
      try {
        await api.put(`tasks/${movedTask.id}`, {
          column: movedTask.column,
          position: movedTask.position,
        });
      } catch {
        toast.error("Error updating task");
      }
    }
  };
  // Handler for priority popup confirmation
  const handleConfirmPriority = async () => {
    if (!pendingPriorityChange) return;
    const { event, oldIndex, newIndex, sourceCol } = pendingPriorityChange;
    const destCol = sourceCol;
    const sourceTasks = tasks.filter((t) => t.column === sourceCol);
    const destTasks = sourceTasks;
    await doDrag(
      event,
      oldIndex,
      newIndex,
      sourceCol,
      destCol,
      sourceTasks,
      destTasks,
    );
    setShowPriorityModal(false);
    setPendingPriorityChange(null);
  };

  const handleCancelPriority = () => {
    setShowPriorityModal(false);
    setPendingPriorityChange(null);
  };

  // Function to delete the current board
  const handleDeleteBoard = async () => {
    if (!boardId) return;
    try {
      await api.delete(`boards/${boardId}`);
      toast.success("Board deleted!");
      window.location.href = "/";
    } catch {
      toast.error("Error deleting board");
    } finally {
      setShowDeleteBoardModal(false);
    }
  };

  // Function to create a new task
  const handleCreate = async (data: any) => {
    if (!data.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!boardId) {
      toast.error("Board not found");
      return;
    }
    try {
      // Ensure board_id is a number
      const res = await api.post("tasks", {
        ...data,
        board_id: Number(boardId),
        column: "backlog",
        position: tasks.filter((t) => t.column === "backlog").length,
      });
      setTasks((t) => [...t, res.data]);
      toast.success("Task created!");
    } catch {
      toast.error("Error creating task");
    }
  };

  // Function to edit a task
  const handleUpdate = async (task: Task) => {
    if (!task.title.trim()) {
      toast.error("Title is required");
      return;
    }
    // Enviar apenas campos permitidos pelo backend
    const payload = {
      title: task.title,
      ticket_number: task.ticket_number,
      ticket_url: task.ticket_url,
      status: task.status,
      description: task.description,
      links: task.links,
      column: task.column,
      position: task.position,
    };
    try {
      const res = await api.put(`tasks/${task.id}`, payload);
      setTasks((t) => t.map((tt) => (tt.id === task.id ? res.data : tt)));
      toast.success("Task updated!");
    } catch {
      toast.error("Error updating task");
    }
  };

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <div className="mb-8 bg-white rounded-md shadow-card p-6 flex items-center justify-between border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          {board && (
            <span
              className={`w-3 h-3 rounded-full ${getBoardColor(board)} flex-shrink-0`}
              aria-hidden="true"
            />
          )}
          <span>{board ? board.name : "My Tasks"}</span>
        </h1>
        <div className="flex items-center gap-3">
          {board && (
            <button
              className="w-9 h-9 rounded-[8px] border border-red-200 bg-white text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 transition flex items-center justify-center"
              type="button"
              onClick={() => setShowDeleteBoardModal(true)}
              aria-label="Delete board"
              title="Delete board"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path
                  d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333A1.333 1.333 0 0 1 11.333 14.667H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <button
            className="px-5 py-2 rounded-[8px] bg-[#6941C6] text-white font-semibold text-sm shadow-sm hover:bg-[#53389E] focus:outline-none focus:ring-2 focus:ring-[#6941C6]/40 transition border border-[#6941C6] flex items-center gap-2"
            type="button"
            onClick={() => setShowAddModal(true)}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M8 3.333v9.334M3.333 8h9.334"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Add new task
          </button>
        </div>
      </div>
      {/* Add task modal */}
      <TaskFormModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(data) => {
          handleCreate(data);
          setShowAddModal(false);
        }}
      />
      {/* Delete board modal */}
      <ConfirmModal
        open={showDeleteBoardModal}
        onClose={() => setShowDeleteBoardModal(false)}
        onConfirm={handleDeleteBoard}
        message={`Are you sure you want to delete the board "${board?.name}"? This will also delete all tasks in this board.`}
        confirmText="Delete Board"
      />
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={(e) => setActiveTaskId(e.active.id as string)}
      >
        <ConfirmPriorityModal
          open={showPriorityModal}
          onClose={handleCancelPriority}
          onConfirm={handleConfirmPriority}
        />
        <div className="flex flex-col md:flex-row gap-8">
          {tasks.filter(
            (t) => t.column === "in_progress" || t.column === "backlog",
          ).length === 0 && !loading ? (
            <div className="w-full text-center text-gray-400 py-12 col-span-2 text-base font-medium">
              no tasks have been created yet
            </div>
          ) : (
            ["in_progress", "backlog"].map((col) => {
              const colTasks = tasks
                .filter((t) => t.column === col)
                .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
              return (
                <div key={col} className="flex-1">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 tracking-tight">
                    {columnNames[col as keyof typeof columnNames]}
                  </h2>
                  <SortableContext
                    items={colTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <DroppableColumn
                      id={col}
                      className={`min-h-[120px] p-3 rounded-md border-2 transition-colors ${colTasks.length === 0 ? "border-dashed border-gray-200 bg-gray-50" : "border-gray-200 bg-white"}`}
                    >
                      {colTasks.length === 0 && (
                        <div className="text-center text-primary text-xs py-8 select-none font-medium">
                          Drag a task here
                        </div>
                      )}
                      {colTasks.map((task, idx) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onUpdate={handleUpdate}
                          onDelete={handleDelete}
                          priority={col === "in_progress" ? idx : undefined}
                        />
                      ))}
                    </DroppableColumn>
                  </SortableContext>
                </div>
              );
            })
          )}
          {loading && (
            <div className="text-gray-400 text-base font-medium">
              Loading...
            </div>
          )}
        </div>
        <DragOverlay>
          {activeTaskId
            ? (() => {
                const task = tasks.find((t) => t.id === activeTaskId);
                if (!task) return null;
                return (
                  <div className="mb-2 border border-gray-200 rounded-md bg-white shadow-card p-4 font-sans flex items-center gap-2 min-w-[220px] max-w-[400px]">
                    <span
                      className="inline-block mr-2 px-2 py-0.5 rounded-[6px] bg-gray-100 text-gray-700 text-[10px] font-bold uppercase align-middle tracking-wide border border-gray-200"
                      style={{ letterSpacing: "0.04em", lineHeight: "16px" }}
                    >
                      PRIO{" "}
                      {typeof task.position === "number"
                        ? task.position + 1
                        : ""}
                    </span>
                    {task.status === "IN PROGRESS" && (
                      <span
                        className="inline-block mr-2 px-2 py-0.5 rounded-[6px] bg-blue-100 text-blue-700 text-[10px] font-bold uppercase align-middle tracking-wide border border-blue-200"
                        style={{ letterSpacing: "0.04em", lineHeight: "16px" }}
                      >
                        IN PROGRESS
                      </span>
                    )}
                    {task.status === "TODO" && (
                      <span
                        className="inline-block mr-2 px-2 py-0.5 rounded-[6px] bg-gray-100 text-gray-500 text-[10px] font-bold uppercase align-middle tracking-wide border border-gray-200"
                        style={{ letterSpacing: "0.04em", lineHeight: "16px" }}
                      >
                        TODO
                      </span>
                    )}
                    {task.status === "DONE" && (
                      <span
                        className="inline-block mr-2 px-2 py-0.5 rounded-[6px] bg-green-100 text-green-700 text-[10px] font-bold uppercase align-middle tracking-wide border border-green-200"
                        style={{ letterSpacing: "0.04em", lineHeight: "16px" }}
                      >
                        DONE
                      </span>
                    )}
                    <span className="font-semibold text-gray-900 truncate">
                      {task.title}
                    </span>
                  </div>
                );
              })()
            : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TasksBoard;
