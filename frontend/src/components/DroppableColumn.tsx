import React from "react";
import { useDroppable } from "@dnd-kit/core";

type DroppableColumnProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  id,
  children,
  className,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={
        (className || "") + (isOver ? " ring-2 ring-primary ring-offset-2" : "")
      }
    >
      {children}
    </div>
  );
};

export default DroppableColumn;
