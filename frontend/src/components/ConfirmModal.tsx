import React from "react";
import { Button } from "@/components/base/buttons/button";
import { ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";
import { AlertCircle } from "@untitledui/icons";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  destructive = false,
}) => {
  return (
    <ModalOverlay isOpen={open} onOpenChange={(v) => !v && onClose()}>
      <Modal className="max-w-sm">
        <Dialog aria-label="Confirm action">
          {({ close }) => (
            <div className="w-full rounded-xl bg-primary p-6 shadow-xl ring-1 ring-primary">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-secondary">
                  <AlertCircle className="size-5 text-fg-error-secondary" />
                </div>
                <p className="pt-2 text-sm font-medium text-primary">{message}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  color={destructive ? "primary-destructive" : "primary"}
                  size="md"
                  className="w-full"
                  onClick={() => { onConfirm(); close(); }}
                  type="button"
                >
                  {confirmText}
                </Button>
                <Button color="secondary" size="md" className="w-full" onClick={close} type="button">
                  {cancelText}
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export const ConfirmPriorityModal: React.FC<Omit<ConfirmModalProps, "message">> = (props) => (
  <ConfirmModal
    {...props}
    message="Are you sure you want to change the priority order of this task?"
    confirmText="Yes"
    cancelText="Cancel"
  />
);
