import React from "react";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xs border border-gray-100">
        <div className="text-gray-900 text-base font-semibold mb-2">
          {message}
        </div>
        <div className="flex flex-col gap-2 mt-6 w-full">
          <button
            className="w-full px-4 py-2 rounded-[8px] border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
            onClick={onClose}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className="w-full px-4 py-2 rounded-[8px] border border-[#6941C6] bg-[#6941C6] text-white font-semibold shadow-sm hover:bg-[#53389E] focus:outline-none focus:ring-2 focus:ring-[#6941C6]/40 transition"
            onClick={onConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ConfirmPriorityModal: React.FC<
  Omit<ConfirmModalProps, "message">
> = (props) => (
  <ConfirmModal
    {...props}
    message="Are you sure you want to change the priority order of this task?"
    confirmText="Yes"
    cancelText="Cancel"
  />
);
