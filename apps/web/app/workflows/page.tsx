"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Workflow {
  id: string;
  name: string;
  description?: string;
  // Add other workflow properties as needed
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchWorkflows = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        router.push("/login"); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await fetch(`http://localhost:3002/workflows`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setWorkflows(data);
        } else {
          setError(data.message || "Failed to fetch workflows.");
          if (response.status === 401 || response.status === 403) {
            router.push("/login"); // Redirect to login on auth failure
          }
        }
      } catch (err) {
        console.error("Error fetching workflows:", err);
        setError("An unexpected error occurred while fetching workflows.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [router]);

  const handleWorkflowClick = (workflowId: string) => {
    router.push(`/workflows/${workflowId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading workflows...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">My Workflows</h1>
      {workflows.length === 0 ? (
        <p className="text-gray-600">No workflows found. Create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleWorkflowClick(workflow.id)}>
              <CardHeader>
                <CardTitle>{workflow.name}</CardTitle>
                {workflow.description && <CardDescription>{workflow.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                {/* You can add more details here if needed */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Button
        onClick={() => router.push("/workflows/new")} // Assuming a new workflow creation page
        className="mt-5 bg-green-500 hover:bg-green-600 text-white"
      >
        Create New Workflow
      </Button>
    </div>
  );
}