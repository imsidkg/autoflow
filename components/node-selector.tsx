import { NodeType } from "@/lib/generated/prisma";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "./ui/separator";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description:
      "Runs the workflow on clicking  a button. Good for getting started quickly",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google For,",
    description:
      "Runs the workflow when a Google Form is submitted",
    icon: '/logos/googleform.svg',
  },
];
const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const NodeSelector = ({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();
  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER
        );

        if (hasManualTrigger) {
          toast.error("Only one manual trigger is allowed per workflow");
          return;
        }
      }

      setNodes((nodes) => {
        const initialNode = nodes.find(
          (node) => node.type === NodeType.INITIAL
        );

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          data: {},
          position: flowPosition,
          type: selection.type,
        };

        if (initialNode) {
          const filteredNodes = nodes.filter(
            (node) => node.type !== NodeType.INITIAL
          );
          return [...filteredNodes, newNode];
        }

        return [...nodes, newNode];
      });

      onOpenChange(false);
    },
    [setNodes, getNodes, onOpenChange, screenToFlowPosition]
  );
  return (
    <div>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>What triggers this workflow</SheetTitle>
            <SheetDescription>
              A trigger is a step that starts your workflow
            </SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            {triggerNodes.map((nodeType) => {
              const Icon = nodeType.icon;

              return (
                <div
                  key={nodeType.type}
                  className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                  onClick={() => {
                    handleNodeSelect(nodeType);
                  }}
                >
                  <div className="flex items-center gap-6 w-full overflow-hidden">
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt={nodeType.label}
                        className="size-5 object-contain rounded-sm"
                      />
                    ) : (
                      <Icon className="size-5" />
                    )}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              );
            })}
            <Separator />
            {executionNodes.map((nodeType) => {
              const Icon = nodeType.icon;

              return (
                <div
                  key={nodeType.type}
                  className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                  onClick={() => {
                    handleNodeSelect(nodeType);
                  }}
                >
                  <div className="flex items-center gap-6 w-full overflow-hidden">
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt={nodeType.label}
                        className="size-5 object-contain rounded-sm"
                      />
                    ) : (
                      <Icon className="size-5" />
                    )}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* <Separator /> */}
          {/* <div className="grid flex-1 auto-rows-min gap-6 px-4"> */}
          {/* {executionNodes.map((nodeType) => {
              const Icon = nodeType.icon;

              return (
                <div
                  key={nodeType.type}
                  className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                  onClick={() => {}}
                >
                  <div className="flex items-center gap-6 w-full overflow-hidden">
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt={nodeType.label}
                        className="size-5 object-contain rounded-sm"
                      />
                    ) : (
                      <Icon className="size-5" />
                    )}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              );
            })} */}
          {/* </div> */}

          <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
