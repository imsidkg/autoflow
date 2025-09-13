"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3002/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        router.push("/workflows");
        
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Button
              variant="link"
              onClick={() => router.push("/register")}
              className="p-0 h-auto"
            >
              Register here
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}