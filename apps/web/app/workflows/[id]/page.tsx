"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ReactFlow,
  addEdge,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomNode from "@/components/CustomNode";

const nodeTypes = {
  custom: CustomNode,
  trigger: CustomNode,
  input: CustomNode,
};

interface WorkflowData {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  connections: Edge[];
  message?: string;
}

export default function WorkflowDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workflowId = params.id as string;

  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const onAddNode = useCallback(
    (sourceNodeId: string) => {
      setNodes((nds) => {
        const sourceNode = nds.find((node) => node.id === sourceNodeId);
        if (!sourceNode) {
          return nds;
        }

        const newNodeId = `node_${new Date().getTime()}`;
        const newNode: Node = {
          id: newNodeId,
          type: "custom",
          position: {
            x: sourceNode.position.x,
            y: sourceNode.position.y + 200,
          },
          data: {
            label: `New Node`,
            onAddNode: onAddNode,
          },
        };

        const newEdge: Edge = {
          id: `e${sourceNodeId}-${newNodeId}`,
          source: sourceNodeId,
          target: newNodeId,
        };

        setEdges((eds) => addEdge(newEdge, eds));
        return [...nds, newNode];
      });
    },
    [setNodes, setEdges]
  );

  const addFirstNode = useCallback(() => {
    const newNodeId = "node_1";
    const newNode: Node = {
      id: newNodeId,
      type: "trigger",
      position: { x: 250, y: 5 },
      data: { label: "Start", onAddNode: onAddNode },
    };
    setNodes([newNode]);
  }, [setNodes, onAddNode]);

  useEffect(() => {
    const fetchWorkflow = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3002/workflows/${workflowId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: WorkflowData = await response.json();

        if (response.ok) {
          setWorkflowName(data.name);
          setWorkflowDescription(data.description || "");
          if (data.nodes && data.nodes.length > 0) {
            const transformedNodes = (data.nodes || []).map((node: any) => ({
              position: Array.isArray(node.position)
                ? { x: node.position[0], y: node.position[1] }
                : node.position,
              data: {
                ...node.data,
                onAddNode: onAddNode,
              },
            }));
            setNodes(transformedNodes);
          } else {
            setNodes([]);
          }
          setEdges(Array.isArray(data.connections) ? data.connections : []);
        } else {
          setError(data.message || "Failed to fetch workflow.");
          if (response.status === 401 || response.status === 403) {
            router.push("/login");
          }
        }
      } catch (err) {
        console.error("Error fetching workflow:", err);
        setError("An unexpected error occurred while fetching the workflow.");
      } finally {
        setLoading(false);
      }
    };

    if (workflowId) {
      fetchWorkflow();
    }
  }, [workflowId, router, setNodes, setEdges, onAddNode]);

  const handleSaveWorkflow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const transformedNodes = nodes.map((node) => ({
      ...node,
      position: [node.position.x, node.position.y],
    }));

    const workflowData: Partial<WorkflowData> = {
      name: workflowName,
      description: workflowDescription,
      nodes: transformedNodes as any,
      connections: edges,
    };

    try {
      const response = await fetch(
        `http://localhost:3002/workflows/${workflowId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(workflowData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Workflow saved successfully!");
      } else {
        setError(data.message || "Failed to save workflow.");
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
        }
      }
    } catch (err) {
      console.error("Error saving workflow:", err);
      setError("An unexpected error occurred while saving the workflow.");
    }
  };

  const handleExecuteWorkflow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3002/workflows/${workflowId}/run`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(`Workflow execution started with ID: ${data.executionId}`);
      } else {
        setError(data.message || "Failed to execute workflow.");
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
        }
      }
    } catch (err) {
      console.error("Error executing workflow:", err);
      setError("An unexpected error occurred while executing the workflow.");
    }
  };

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading workflow...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Workflow: {workflowName}</h1>
        <div>
          <Button onClick={handleExecuteWorkflow} className="mr-2">Execute Workflow</Button>
          <Button onClick={handleSaveWorkflow}>Save Workflow</Button>
        </div>
      </div>
      <div className="flex flex-grow">
        <div className="w-1/4 p-4 border-r">
          <h2 className="text-xl font-semibold mb-4">Workflow Details</h2>
          <div className="mb-4">
            <Label
              htmlFor="workflowName"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </Label>
            <Input
              id="workflowName"
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="workflowDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="workflowDescription"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              className="mt-1 block w-full"
              rows={4}
            />
          </div>
          {/* Add more workflow properties here */}
        </div>
        <div className="flex-grow relative">
          {nodes.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Button onClick={addFirstNode}>Add First Node</Button>
            </div>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            className="react-flow-canvas"
            style={{ width: "100%", height: "100%" }}
            fitView
          >
            <Controls />
            {/* You can add custom nodes, controls, etc. here */}
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
