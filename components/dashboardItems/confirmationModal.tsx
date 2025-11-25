import React from "react";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title: string;
}

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  message,
  title,
}: ConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] m-4 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#004851] border-4 border-[#03BFB5] rounded-lg p-6 min-w-[300px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#03BFB5] text-2xl font-bold focus:outline-none"
        >
          ×
        </button>
        <h2 className="text-[#03BFB5] text-xl font-bold mb-4">{title}</h2>
        <p className="text-white text-lg mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-white font-bold py-2 px-4 rounded-md border border-white hover:bg-white hover:text-[#004851]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#03BFB5] text-white font-bold py-2 px-4 rounded-md hover:bg-[#03BFB5]/80"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}