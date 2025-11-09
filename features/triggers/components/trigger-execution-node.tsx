import { memo } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { NodeProps, Position } from "@xyflow/react";
import { WorkflowNode } from "@/components/workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/base-node";
import { BaseHandle } from "@/components/base-handle";


interface BaseNodeTriggerProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
  }: BaseNodeTriggerProps) => {
    const handleDelete = () => {};

    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        <BaseNode onDoubleClick={onDoubleClick} className="roundedl-2xl relative group">
          <BaseNodeContent>
            {typeof Icon === "string" ? (
              <Image src={Icon} alt={name} width={16} height={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
          </BaseNodeContent>

          {children}

          {/* <BaseHandle id="target-1" type="target" position={Position.Left} /> */}
          <BaseHandle id="source-1" type="source" position={Position.Right} />
        </BaseNode>
      </WorkflowNode>
    );
  }
);

BaseTriggerNode.displayName = "BaseTriggerNode";
