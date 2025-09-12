"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
        const response = await fetch(`http://localhost:3002/workflows`, { // Using the new /workflows endpoint
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
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading workflows...</div>;
  }

  if (error) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "red" }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Workflows</h1>
      {workflows.length === 0 ? (
        <p>No workflows found. Create one!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {workflows.map((workflow) => (
            <li key={workflow.id} style={{ marginBottom: "10px", border: "1px solid #eee", padding: "10px", borderRadius: "5px", cursor: "pointer" }}
                onClick={() => handleWorkflowClick(workflow.id)}>
              <h2>{workflow.name}</h2>
              {workflow.description && <p>{workflow.description}</p>}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => router.push("/workflows/new")} // Assuming a new workflow creation page
        style={{ padding: "10px", borderRadius: "4px", border: "none", backgroundColor: "#28a745", color: "white", cursor: "pointer", marginTop: "20px" }}
      >
        Create New Workflow
      </button>
    </div>
  );
}