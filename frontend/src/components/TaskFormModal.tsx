import React, { useEffect, useState } from "react";
import { Task } from "../types";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";
import { NativeSelect } from "@/components/base/select/select-native";
import { ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";
import { X } from "@untitledui/icons";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initial?: Partial<Task>;
};

const TaskFormModal: React.FC<Props> = ({ open, onClose, onSubmit, initial }) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [ticket, setTicket] = useState(initial?.ticket_number || "");
  const [url, setUrl] = useState(initial?.ticket_url || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [status, setStatus] = useState(initial?.status || "TODO");

  useEffect(() => {
    setTitle(initial?.title || "");
    setTicket(initial?.ticket_number || "");
    setUrl(initial?.ticket_url || "");
    setDescription(initial?.description || "");
    setStatus(initial?.status || "TODO");
  }, [open, initial]);

  return (
    <ModalOverlay isOpen={open} onOpenChange={(v) => !v && onClose()}>
      <Modal className="max-w-lg">
        <Dialog aria-label={initial?.title ? "Edit task" : "Add new task"}>
          {({ close }) => (
            <div className="w-full rounded-xl bg-primary p-6 shadow-xl ring-1 ring-primary">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary">
                  {initial?.title ? "Edit task" : "Add new task"}
                </h2>
                <Button color="tertiary" size="sm" iconLeading={X} onClick={close} aria-label="Close" />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit({ title, ticket_number: ticket, ticket_url: url, status, description });
                }}
                className="flex flex-col gap-4"
              >
                <Input
                  label="Title"
                  placeholder="Enter task title"
                  value={title}
                  onChange={setTitle}
                  isRequired
                />
                <Input
                  label="Ticket"
                  placeholder="Ticket number (optional)"
                  value={ticket}
                  onChange={setTicket}
                />
                <Input
                  label="Ticket URL"
                  placeholder="Ticket URL (optional)"
                  value={url}
                  onChange={setUrl}
                />
                <NativeSelect
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={[
                    { label: "TODO", value: "TODO" },
                    { label: "IN PROGRESS", value: "IN PROGRESS" },
                    { label: "DONE", value: "DONE" },
                  ]}
                />
                <Input
                  label="Description"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={setDescription}
                />

                <div className="flex justify-end gap-2 mt-2">
                  <Button color="secondary" size="md" onClick={close} type="button">
                    Cancel
                  </Button>
                  <Button color="primary" size="md" type="submit">
                    {initial?.title ? "Save changes" : "Add task"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default TaskFormModal;
