"use client"; // This is a client component

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if a token exists in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // If authenticated, redirect to the workflows page
      router.push("/workflows");
    } else {
      // If not authenticated, redirect to the login page
      router.push("/login");
    }
  }, [router]); // Dependency array includes router to re-run effect if router object changes

  // You can render a loading spinner or a simple message while redirecting
  return (
    <div className="flex justify-center items-center h-screen">
      <p>Redirecting...</p>
    </div>
  );
}