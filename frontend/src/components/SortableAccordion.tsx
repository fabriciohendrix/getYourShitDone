import React, { useState } from "react";
import { Task } from "../types";
import TaskFormModal from "./TaskFormModal";
import { ConfirmModal } from "./ConfirmModal";

interface SortableAccordionProps {
  task: Task;
  onUpdate: (t: Task) => void;
  onDelete: (id: string) => void;
  priority: boolean;
}

/**
 * Accordion component for displaying and editing a single task.
 * Handles edit and delete modals for the task.
 */
const SortableAccordion: React.FC<SortableAccordionProps> = ({
  task,
  onUpdate,
  onDelete,
  priority,
}) => {
  const [open, setOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Enable drag-and-drop by forwarding dnd-kit props
  return (
    <div
      className="mb-2 border border-gray-200 rounded-md bg-white shadow-card p-4 font-sans"
      id={task.id}
      data-id={task.id}
      // dnd-kit expects draggable items to have these attributes set by SortableContext
      // They will be injected automatically, but if you use a custom component, you must forward them
      // If you use TaskCard, you must use useSortable and forward attributes and listeners
      // Here, we ensure the div is recognized as a sortable item
      tabIndex={0}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          {/* Show PRIO badge only for in_progress column */}
          {priority && typeof task.position === "number" && (
            <span
              className="inline-block mr-2 px-2 py-0.5 rounded-[6px] bg-gray-100 text-gray-700 text-[10px] font-bold uppercase align-middle tracking-wide border border-gray-200"
              style={{ letterSpacing: "0.04em", lineHeight: "16px" }}
            >
              PRIO {task.position + 1}
            </span>
          )}
          {/* Status badge for all tasks */}
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
          <span className="font-semibold text-[#101828] truncate">
            {task.title}
          </span>
        </div>
        <button
          type="button"
          className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 18 18"
            aria-hidden="true"
            focusable="false"
          >
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

export default SortableAccordion;
