import React from "react";
import { Button } from "@/components/base/buttons/button";
import { ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Trash01, AlertCircle } from "@untitledui/icons";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  destructive = false,
}) => {
  return (
    <ModalOverlay isOpen={open} onOpenChange={(v) => !v && onClose()}>
      <Modal className="max-w-sm">
        <Dialog aria-label={title}>
          {({ close }) => (
            <div className="w-full rounded-xl bg-primary p-6 shadow-xl ring-1 ring-primary">
              <div className="mb-5 flex flex-col gap-4">
                <FeaturedIcon
                  icon={destructive ? Trash01 : AlertCircle}
                  color={destructive ? "error" : "warning"}
                  theme="light"
                  size="md"
                />
                <div>
                  <h3 className="text-lg font-semibold text-primary">{title}</h3>
                  <p className="mt-1 text-sm text-tertiary">{message}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
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

export const ConfirmPriorityModal: React.FC<Omit<ConfirmModalProps, "title" | "message">> = (props) => (
  <ConfirmModal
    {...props}
    title="Change priority"
    message="Are you sure you want to change the priority order of this task?"
    confirmText="Yes"
    cancelText="Cancel"
  />
);
