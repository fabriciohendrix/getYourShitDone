import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../types";
import TaskFormModal from "./TaskFormModal";
import { ConfirmModal } from "./ConfirmModal";
import { Button } from "@/components/base/buttons/button";
import { Plus, Minus } from "@untitledui/icons";
import { cx } from "@/utils/cx";

type TaskCardProps = {
  task: Task;
  onUpdate: (t: Task) => void;
  onDelete: (id: string) => void;
  priority?: number;
};

const statusStyles: Record<string, string> = {
  "IN PROGRESS": "bg-brand-secondary text-brand-secondary ring-1 ring-brand_subtle",
  "TODO": "bg-secondary text-tertiary ring-1 ring-primary",
  "DONE": "bg-success-secondary text-success-primary ring-1 ring-success_subtle",
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete, priority }) => {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="mb-3 rounded-xl bg-primary shadow-xs ring-1 ring-primary transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex flex-1 min-w-0 items-center gap-2 flex-wrap" {...listeners}>
          {typeof priority === "number" && (
            <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-tertiary ring-1 ring-primary select-none">
              #{priority + 1}
            </span>
          )}
          {task.status && (
            <span className={cx("inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium select-none", statusStyles[task.status] || statusStyles["TODO"])}>
              {task.status}
            </span>
          )}
          <span className="text-sm font-semibold text-primary truncate">{task.title}</span>
        </div>
        <Button
          color="tertiary"
          size="xs"
          iconLeading={open ? Minus : Plus}
          onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
          aria-label={open ? "Collapse" : "Expand"}
        />
      </div>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-secondary space-y-2">
          {task.ticket_number && (
            <div className="text-sm text-tertiary">
              <span className="font-medium text-secondary">Ticket: </span>
              <a href={task.ticket_url} className="text-brand-secondary underline underline-offset-2 hover:text-brand-secondary_hover" target="_blank" rel="noopener noreferrer">
                {task.ticket_number}
              </a>
            </div>
          )}
          {task.description && (
            <div className="text-sm text-tertiary">
              <span className="font-medium text-secondary">Description: </span>
              {task.description}
            </div>
          )}
          {Array.isArray(task.links) && task.links.length > 0 && (
            <div className="text-sm text-tertiary">
              <span className="font-medium text-secondary">Links: </span>
              {task.links.map((l: string, i: number) => (
                <a key={i} href={l} className="text-brand-secondary underline underline-offset-2 hover:text-brand-secondary_hover ml-1" target="_blank" rel="noopener noreferrer">
                  {l}
                </a>
              ))}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button color="secondary" size="xs" onClick={() => setShowEdit(true)} type="button">
              Edit task
            </Button>
            <Button color="primary-destructive" size="xs" onClick={() => setShowConfirm(true)} type="button">
              Delete task
            </Button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => { setShowConfirm(false); onDelete(task.id); }}
        message="Are you sure you want to delete this task?"
        confirmText="Delete"
        cancelText="Cancel"
        destructive
      />
      <TaskFormModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        initial={task}
        onSubmit={(data) => { onUpdate({ ...task, ...data }); setShowEdit(false); }}
      />
    </div>
  );
};

export default TaskCard;
