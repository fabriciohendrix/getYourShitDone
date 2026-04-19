import React, { useEffect, useState } from "react";
import { Task } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initial?: Partial<Task>;
};

const TaskFormModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  initial,
}) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [ticket, setTicket] = useState(initial?.ticket_number || "");
  const [url, setUrl] = useState(initial?.ticket_url || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [status, setStatus] = useState(initial?.status || "");

  useEffect(() => {
    setTitle(initial?.title || "");
    setTicket(initial?.ticket_number || "");
    setUrl(initial?.ticket_url || "");
    setDescription(initial?.description || "");
    setStatus(initial?.status || "");
  }, [open, initial]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg border border-gray-100 relative">
        <button
          type="button"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition shadow-sm"
          aria-label="Close modal"
          onClick={onClose}
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
          {initial ? "Edit task" : "Add new task"}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              title,
              ticket_number: ticket,
              ticket_url: url,
              status,
              description,
            });
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-primary">*</span>
              </label>
              <input
                className="px-3 py-2 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm placeholder-gray-400 transition"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Ticket
              </label>
              <input
                className="px-3 py-2 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm placeholder-gray-400 transition"
                placeholder="Ticket number (optional)"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Ticket URL
              </label>
              <input
                className="px-3 py-2 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm placeholder-gray-400 transition"
                placeholder="Ticket URL (optional)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                className="px-3 py-2 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition bg-white"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="TODO" className="text-gray-500">
                  TODO
                </option>
                <option value="IN PROGRESS" className="text-blue-700">
                  IN PROGRESS
                </option>
                <option value="DONE" className="text-green-700">
                  DONE
                </option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                className="px-3 py-2 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm placeholder-gray-400 transition"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded-[8px] border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-[8px] bg-[#6941C6] text-white font-semibold text-sm shadow-sm hover:bg-[#53389E] focus:outline-none focus:ring-2 focus:ring-[#6941C6]/40 transition border border-[#6941C6] flex items-center gap-2"
            >
              {initial ? "Save changes" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
