"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function NewWorkflowPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    const ownerId = localStorage.getItem("userId");

    if (!token || !ownerId) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/workflows/workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, ownerId, nodes: [], connections: {} }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Workflow created successfully!");
        router.push(`/workflows/${data.id}`);
      } else {
        setError(data.message || "Failed to create workflow.");
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
        }
      }
    } catch (err) {
      console.error("Error creating workflow:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create New Workflow</CardTitle>
          <CardDescription className="text-center">
            Enter the details for your new workflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateWorkflow} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="My Awesome Workflow"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="A brief description of my workflow."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Workflow"}
            </Button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}