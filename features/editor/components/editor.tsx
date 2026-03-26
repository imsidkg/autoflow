"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflow";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "@/components/add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { NodeType } from "@/lib/generated/prisma";
import ExecuteWorkflowButton from "./execute-workflow-button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ArrowUp } from "lucide-react";

const initialNodes: Node[] = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    data: { label: "Node 1" },
  },
  {
    id: "n2",
    position: { x: 0, y: 100 },
    data: { label: "Node 2" },
  },
];

const initialEdges: Edge[] = [{ id: "n1-n2", source: "n1", target: "n2" }];

type GraphPlan = {
  nodes: Array<{
    key: string;
    type: NodeType;
    position: { x: number; y: number };
    data: Record<string, unknown>;
  }>;
  edges: Array<{
    from: string;
    to: string;
    fromOutput: string;
    toInput: string;
  }>;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [applyMode, setApplyMode] = useState<"append" | "replace">("append");
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; role: "user" | "assistant"; content: string }>
  >([]);
  const instructionsRef = useRef<HTMLTextAreaElement | null>(null);

  const trpc = useTRPC();
  const generateGraphPlanMutation = useMutation(
    trpc.workflows.generateFromInstructions.mutationOptions({
      onError: (err) => {
        toast.error(err.message ?? "Failed to generate workflow plan");
      },
    })
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const applyGraphPlan = useCallback(
    (plan: GraphPlan, mode: "append" | "replace") => {
      const currentNodes = nodes;
      const currentEdges = edges;

      const existingManualTriggerId = currentNodes.find(
        (node) => node.type === NodeType.MANUAL_TRIGGER
      )?.id;

      // Remove INITIAL if we are generating a real graph (matches existing UI behavior).
      const planHasNonInitial = plan.nodes.some(
        (n) => n.type !== NodeType.INITIAL
      );

      const nextNodes: Node[] =
        mode === "replace"
          ? []
          : planHasNonInitial
            ? currentNodes.filter((n) => n.type !== NodeType.INITIAL)
            : currentNodes;

      let nextEdges: Edge[] = mode === "replace" ? [] : currentEdges;

      const allowedNodeIds = new Set(nextNodes.map((n) => n.id));
      nextEdges = nextEdges.filter(
        (e) => allowedNodeIds.has(e.source) && allowedNodeIds.has(e.target)
      );

      const manualPlanKeys = plan.nodes
        .filter((n) => n.type === NodeType.MANUAL_TRIGGER)
        .map((n) => n.key);

      // If appending and there is already a manual trigger, remove new manual trigger(s)
      // and rewire their outgoing edges to the existing one.
      const keptPlanNodes =
        mode === "append" && existingManualTriggerId
          ? plan.nodes.filter((n) => n.type !== NodeType.MANUAL_TRIGGER)
          : plan.nodes;

      const nodeIdByKey: Record<string, string> = {};
      for (const node of keptPlanNodes) {
        nodeIdByKey[node.key] = createId();
      }

      const offsetX =
        mode === "append" && nextNodes.length > 0
          ? Math.max(
              ...nextNodes.map((n) =>
                typeof n.position?.x === "number" ? n.position.x : 0
              )
            ) + 250
          : 0;
      const offsetY = mode === "append" ? 0 : 0;

      const nodesToAdd: Node[] = keptPlanNodes.map((n) => ({
        id: nodeIdByKey[n.key],
        type: n.type,
        position: {
          x: n.position.x + offsetX,
          y: n.position.y + offsetY,
        },
        data: n.data ?? {},
      }));

      const edgesToAdd: Edge[] = [];
      for (const edge of plan.edges) {
        const fromIsRemovedManual =
          mode === "append" &&
          existingManualTriggerId &&
          manualPlanKeys.includes(edge.from);

        if (fromIsRemovedManual) {
          const targetId = nodeIdByKey[edge.to];
          if (!targetId) continue;
          edgesToAdd.push({
            id: createId(),
            source: existingManualTriggerId,
            target: targetId,
            sourceHandle: edge.fromOutput,
            targetHandle: edge.toInput,
          });
          continue;
        }

        const sourceId = nodeIdByKey[edge.from];
        const targetId = nodeIdByKey[edge.to];
        if (!sourceId || !targetId) continue;

        edgesToAdd.push({
          id: createId(),
          source: sourceId,
          target: targetId,
          sourceHandle: edge.fromOutput,
          targetHandle: edge.toInput,
        });
      }

      setNodes([...nextNodes, ...nodesToAdd]);
      setEdges([...nextEdges, ...edgesToAdd]);
    },
    [nodes, edges]
  );

  const handleGenerate = async () => {
    const trimmed = instructions.trim();
    if (!trimmed) {
      toast.error("Enter workflow instructions first");
      return;
    }

    try {
      const plan = await generateGraphPlanMutation.mutateAsync({
        workflowId,
        instructions: trimmed,
        mode: applyMode,
      });

      const typedPlan = plan as GraphPlan;

      applyGraphPlan(typedPlan, applyMode);
      setChatMessages((prev) => [
        ...prev,
        { id: createId(), role: "user", content: trimmed },
        {
          id: createId(),
          role: "assistant",
          content: `Generated ${typedPlan.nodes.length} nodes and ${typedPlan.edges.length} edges. Review and hit Save.`,
        },
      ]);
      setInstructions("");
      setInstructionsOpen(false);
      toast.success("Generated workflow. Review nodes and hit Save.");
    } catch {
      // Error toast handled in mutation onError.
    }
  };

  useEffect(() => {
    const textarea = instructionsRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const maxHeight = 180;
    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [instructions]);

  const handleComposerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!generateGraphPlanMutation.isPending && instructions.trim().length > 0) {
        void handleGenerate();
      }
    }
  };

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeComponents}
        onInit={setEditor}
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
      >
        <Background variant={BackgroundVariant.Cross} />
        <Controls />
        <Panel position="top-right">
          <div className="flex flex-col gap-2">
            <AddNodeButton />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setInstructionsOpen(true)}
              className="bg-background"
              title="Instructions"
            >
              <MessageSquare className="size-4" />
              <span className="sr-only">Instructions</span>
            </Button>
          </div>
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>

      <Sheet open={instructionsOpen} onOpenChange={setInstructionsOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl overflow-hidden flex flex-col"
        >
          <SheetHeader>
            <SheetTitle>Workflow Instructions</SheetTitle>
            <SheetDescription>
              Describe what you want, and we will generate a workflow graph.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 flex-1 min-h-0 px-5 pb-5 flex flex-col">
            <div className="flex-1 min-h-0 overflow-auto rounded-lg border bg-card p-3 space-y-3">
              {chatMessages.length > 0 ? (
                chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={m.role === "user" ? "text-right" : "text-left"}
                  >
                    <div
                      className={
                        m.role === "user"
                          ? "inline-block rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm"
                          : "inline-block rounded-lg bg-muted px-3 py-2 text-sm text-foreground"
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  Start by describing the workflow you want to build.
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border bg-background px-3 py-2">
                <div className="flex items-end gap-2">
                  <Textarea
                    id="workflow-instructions"
                    ref={instructionsRef}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="Describe the workflow..."
                    className="min-h-9 max-h-44 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={handleGenerate}
                    disabled={
                      generateGraphPlanMutation.isPending ||
                      instructions.trim().length === 0
                    }
                    className="rounded-full"
                  >
                    <ArrowUp className="size-4" />
                    <span className="sr-only">Generate</span>
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={applyMode === "append" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setApplyMode("append")}
                >
                  Append
                </Button>
                <Button
                  type="button"
                  variant={applyMode === "replace" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setApplyMode("replace")}
                >
                  Replace
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
