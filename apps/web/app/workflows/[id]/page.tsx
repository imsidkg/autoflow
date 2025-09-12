"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WorkflowData {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  connections: Edge[]; // Backend uses 'connections', React Flow uses 'edges'
  message?: string; // Added to handle error messages from API
}

export default function WorkflowDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workflowId = params.id as string;

  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch workflow data
  useEffect(() => {
    const fetchWorkflow = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3002/workflows/${workflowId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data: WorkflowData = await response.json();

        if (response.ok) {
          setWorkflowName(data.name);
          setWorkflowDescription(data.description || "");
          setNodes(data.nodes || []);
          setEdges(data.connections || []); // Map backend 'connections' to frontend 'edges'
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
  }, [workflowId, router]);

  // Save workflow data
  const handleSaveWorkflow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const workflowData: Partial<WorkflowData> = {
      name: workflowName,
      description: workflowDescription,
      nodes: nodes,
      connections: edges, // Map frontend 'edges' back to backend 'connections'
    };

    try {
      const response = await fetch(`http://localhost:3002/workflows/${workflowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workflowData),
      });

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

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading workflow...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Workflow: {workflowName}</h1>
        <Button onClick={handleSaveWorkflow}>Save Workflow</Button>
      </div>
      <div className="flex flex-grow">
        <div className="w-1/4 p-4 border-r">
          <h2 className="text-xl font-semibold mb-4">Workflow Details</h2>
          <div className="mb-4">
            <Label htmlFor="workflowName" className="block text-sm font-medium text-gray-700">Name</Label>
            <Input
              id="workflowName"
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="workflowDescription" className="block text-sm font-medium text-gray-700">Description</Label>
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
        <div className="flex-grow">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className="react-flow-canvas"
          >
            {/* You can add custom nodes, controls, etc. here */}
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}