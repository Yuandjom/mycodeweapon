"use client";

import React, { useState } from "react";
import { ResizablePanel } from "@/components/ui/resizable";

interface CollapsiblePanelProps {
  children: React.ReactNode;
  defaultSize: number;
  className?: string;
  collapseThreshold?: number;
  collapsedSize?: number;
  collapsedText: string;
  onResize?: (size: number) => void;
}

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  children,
  defaultSize,
  className = "",
  collapseThreshold = 5,
  collapsedSize = 5,
  collapsedText = "Collapse Panel",
  onResize,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleResize = (size: number) => {
    if (!isCollapsed && size < collapseThreshold) {
      setIsCollapsed(true);
    } else if (isCollapsed && size > collapseThreshold) {
      setIsCollapsed(false);
    }

    onResize?.(size);
  };

  return (
    <ResizablePanel
      defaultSize={defaultSize}
      onResize={handleResize}
      className={`${className}`}
      minSize={collapsedSize}
    >
      {isCollapsed ? (
        <div className="h-full w-full flex_center bg-muted/50 px-4 py-2 rounded-md">
          <span className="text-sm text-center font-medium">
            {collapsedText}
          </span>
        </div>
      ) : (
        <div className="relative h-full">
          <div className="h-full">{children}</div>
        </div>
      )}
    </ResizablePanel>
  );
};

export default CollapsiblePanel;
