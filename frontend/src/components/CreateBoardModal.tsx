import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { X } from "@untitledui/icons";
import api from "../api";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";
import { Label } from "@/components/base/input/label";
import { ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";

const COLOR_OPTIONS = [
  { value: "bg-purple-500", hex: "#A855F7" },
  { value: "bg-blue-500", hex: "#3B82F6" },
  { value: "bg-pink-500", hex: "#EC4899" },
  { value: "bg-green-500", hex: "#22C55E" },
  { value: "bg-orange-500", hex: "#F97316" },
  { value: "bg-red-500", hex: "#EF4444" },
  { value: "bg-indigo-500", hex: "#6366F1" },
  { value: "bg-cyan-500", hex: "#06B6D4" },
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
    <ModalOverlay isOpen={isOpen} onOpenChange={(v) => !v && handleClose()}>
      <Modal className="max-w-sm">
        <Dialog aria-label="Create new board">
          {({ close }) => (
            <div className="w-full rounded-xl bg-primary p-6 shadow-xl ring-1 ring-primary">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary">Create new board</h2>
                <Button color="tertiary" size="sm" iconLeading={X} onClick={() => { handleClose(); close(); }} aria-label="Close" />
              </div>

              <div className="flex flex-col gap-4">
                <Input
                  label="Board name"
                  placeholder="My board"
                  value={name}
                  onChange={setName}
                  isDisabled={creating}
                  autoFocus
                  isRequired
                />

                <div>
                  <Label className="mb-2">Choose color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className={`h-6 w-6 rounded-full transition-all ${c.value} ${
                          color === c.value
                            ? "ring-2 ring-offset-2 ring-primary scale-110"
                            : "hover:scale-105"
                        }`}
                        onClick={() => setColor(c.value)}
                        aria-label={c.value}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  color="primary"
                  size="md"
                  className="w-full mt-2"
                  onClick={handleCreate}
                  isDisabled={creating || !name.trim()}
                  isLoading={creating}
                  type="button"
                >
                  Create board
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default CreateBoardModal;
