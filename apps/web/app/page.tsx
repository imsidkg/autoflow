'use client'
import { User } from "@repo/db";
import { getDataSource } from "../lib/db";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

// async function getUsers() {
//   const dataSource = await getDataSource();
//   const userRepository = dataSource.getRepository(User);
//   // For this example, let's ensure a user exists.
//   // In a real app, you wouldn't create users on a page load.
//   const userCount = await userRepository.count();
//   if (userCount === 0) {
//     const newUser = new User();
//     newUser.email = `user@example.com`;
//     newUser.firstName = "John";
//     newUser.lastName = "Doe";
//     newUser.passwordHash = "password";
//     await userRepository.save(newUser);
//   }
//   return userRepository.find();
// }

export default  function Home() {
  // const users = await getUsers();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    // <div className={styles.page}>
    //   <main className={styles.main}>
    //     <h1 className={styles.title}>Users</h1>
    //     {users.length > 0 ? (
    //       <ul>
    //         {users.map((user:any) => (
    //           <li key={user.id}>
    //             {user.firstName} {user.lastName} ({user.email})
    //           </li>
    //         ))}
    //       </ul>
    //     ) : (
    //       <p>No users found.</p>
    //     )}
    //   </main>
    // </div>

    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}
