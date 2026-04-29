import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../types";
import TaskFormModal from "./TaskFormModal";
import { ConfirmModal } from "./ConfirmModal";
import { Button } from "@/components/base/buttons/button";
import { Plus, Minus } from "@untitledui/icons";

type TaskCardProps = {
  task: Task;
  onUpdate: (t: Task) => void;
  onDelete: (id: string) => void;
  priority?: number;
};

const badgeBase =
  "inline-block px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wide border align-middle select-none";

const statusStyles: Record<string, string> = {
  "IN PROGRESS": "bg-blue-100 text-blue-700 border-blue-200",
  TODO: "bg-gray-100 text-gray-500 border-gray-200",
  DONE: "bg-green-100 text-green-700 border-green-200",
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
    zIndex: isDragging ? 50 : ("auto" as const),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-3 rounded-md bg-white border border-gray-200 shadow-sm transition-shadow hover:shadow-md cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex flex-1 min-w-0 items-center gap-2 flex-wrap">
          {typeof priority === "number" && (
            <span
              className={`${badgeBase} bg-gray-100 text-gray-700 border-gray-200`}
              style={{ letterSpacing: "0.04em", lineHeight: "16px" }}
            >
              PRIO #{priority + 1}
            </span>
          )}
          {task.status && (
            <span
              className={`${badgeBase} ${statusStyles[task.status] ?? statusStyles["TODO"]}`}
              style={{ letterSpacing: "0.04em", lineHeight: "16px" }}
            >
              {task.status}
            </span>
          )}
          <span className="text-sm font-semibold text-gray-900 truncate">
            {task.title}
          </span>
        </div>
        <Button
          color="tertiary"
          size="xs"
          iconLeading={open ? Minus : Plus}
          onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          aria-label={open ? "Collapse" : "Expand"}
        />
      </div>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-2">
          {task.ticket_number && (
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Ticket: </span>
              <a
                href={task.ticket_url}
                className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                {task.ticket_number}
              </a>
            </div>
          )}
          {task.description && (
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Description: </span>
              {task.description}
            </div>
          )}
          {Array.isArray(task.links) && task.links.length > 0 && (
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Links: </span>
              {task.links.map((l: string, i: number) => (
                <a
                  key={i}
                  href={l}
                  className="text-blue-600 underline underline-offset-2 hover:text-blue-800 ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l}
                </a>
              ))}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button
              color="secondary"
              size="xs"
              onClick={() => setShowEdit(true)}
              type="button"
            >
              Edit task
            </Button>
            <Button
              color="primary-destructive"
              size="xs"
              onClick={() => setShowConfirm(true)}
              type="button"
            >
              Delete task
            </Button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          onDelete(task.id);
        }}
        message="Are you sure you want to delete this task?"
        confirmText="Delete"
        cancelText="Cancel"
        destructive
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
  );
};

export default TaskCard;
