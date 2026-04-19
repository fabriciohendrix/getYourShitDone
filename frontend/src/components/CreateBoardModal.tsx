import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

const COLOR_OPTIONS = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-cyan-500",
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const CreateBoardModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("bg-purple-500");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    setName("");
    setColor("bg-purple-500");
    onClose();
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      await api.post("boards", { name, color });
      onCreated();
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      handleClose();
      navigate(`/board/${slug}`);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error?.message ||
          err?.response?.data?.error ||
          "Error creating board",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xs border border-gray-100 relative">
        <button
          type="button"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition shadow-sm"
          aria-label="Close modal"
          onClick={handleClose}
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          autoFocus
          disabled={creating}
        />
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 block">
            Choose color
          </label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                className={`w-5 h-5 rounded-full transition-all ${c} ${
                  color === c
                    ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                    : "hover:scale-105"
                }`}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
        <button
          className="w-full px-4 py-2 rounded-[8px] border border-[#6941C6] bg-[#6941C6] text-white font-semibold shadow-sm hover:bg-[#53389E] focus:outline-none focus:ring-2 focus:ring-[#6941C6]/40 transition"
          onClick={handleCreate}
          disabled={creating || !name.trim()}
        >
          {creating ? "Creating..." : "Create board"}
        </button>
      </div>
    </div>
  );
};

export default CreateBoardModal;
