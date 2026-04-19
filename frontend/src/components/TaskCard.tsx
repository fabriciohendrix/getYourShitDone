import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../types";
import TaskFormModal from "./TaskFormModal";
import { ConfirmModal } from "./ConfirmModal";

type TaskCardProps = {
  task: Task;
  onUpdate: (t: Task) => void;
  onDelete: (id: string) => void;
  priority?: number;
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  priority,
}) => {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="mb-3 border border-gray-200 rounded-md bg-white shadow-card transition-all hover:shadow-lg font-sans"
    >
      <div className="flex items-center justify-between px-4 py-2">
        <div
          className="font-semibold flex-1 select-none text-[#53389E] text-base"
          {...listeners}
        >
          {typeof priority === "number" ? (
            <>
              <span
                className="inline-block mr-2 px-2 py-0.5 rounded-[6px] bg-gray-100 text-gray-700 text-[10px] font-bold uppercase align-middle tracking-wide border border-gray-200"
                style={{ letterSpacing: "0.04em", lineHeight: "16px" }}
              >
                PRIO {priority + 1}
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
            </>
          ) : null}
          {task.title}
        </div>
        <button
          className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          aria-label={open ? "Close details" : "Open details"}
          type="button"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
            {open ? (
              <path
                d="M5 9h8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <>
                <path
                  d="M9 5v8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 9h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="px-4 py-3 border-t border-gray-100 text-sm space-y-1 bg-gray-50 rounded-b-md">
          <div>
            <b className="text-gray-700">Ticket:</b>{" "}
            <a
              href={task.ticket_url}
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {task.ticket_number}
            </a>
          </div>
          <div>
            <b className="text-gray-700">Status:</b> {task.status}
          </div>
          <div>
            <b className="text-gray-700">Description:</b> {task.description}
          </div>
          <div>
            <b className="text-gray-700">Links:</b>{" "}
            {Array.isArray(task.links)
              ? task.links.map((l: string, i: number) => (
                  <a
                    key={i}
                    href={l}
                    className="text-primary underline ml-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l}
                  </a>
                ))
              : null}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="w-fit px-3 py-1.5 rounded-[6px] border border-[#6941C6] bg-white text-[#6941C6] text-xs font-semibold shadow-sm hover:bg-[#F4EBFF] focus:outline-none focus:ring-2 focus:ring-[#6941C6]/40 transition"
              style={{ minWidth: "96px" }}
              onClick={() => setShowEdit(true)}
              type="button"
            >
              Edit task
            </button>
            <button
              className="w-fit px-3 py-1.5 rounded-[6px] border border-[#D92D20] bg-[#D92D20] text-white text-xs font-semibold shadow-sm hover:bg-[#B42318] focus:outline-none focus:ring-2 focus:ring-[#D92D20]/40 transition"
              style={{ minWidth: "96px" }}
              onClick={() => setShowConfirm(true)}
              type="button"
            >
              Delete task
            </button>
          </div>
          <ConfirmModal
            open={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              onDelete(task.id);
            }}
            message="Are you sure you want to delete this task?"
            confirmText="Yes"
            cancelText="Cancel"
          />
          <TaskFormModal
            open={showEdit}
            onClose={() => setShowEdit(false)}
            initial={task}
            onSubmit={(data) => {
              onUpdate({ ...task, ...data });
              setShowEdit(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TaskCard;
