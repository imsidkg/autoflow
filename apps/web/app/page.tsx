import { User } from "@repo/db";
import { getDataSource } from "../lib/db";
import styles from "./page.module.css";

async function getUsers() {
  const dataSource = await getDataSource();
  const userRepository = dataSource.getRepository(User);
  // For this example, let's ensure a user exists.
  // In a real app, you wouldn't create users on a page load.
  const userCount = await userRepository.count();
  if (userCount === 0) {
    const newUser = new User();
    newUser.email = `user@example.com`;
    newUser.firstName = "John";
    newUser.lastName = "Doe";
    newUser.passwordHash = "password";
    await userRepository.save(newUser);
  }
  return userRepository.find();
}

export default async function Home() {
  const users = await getUsers();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Users</h1>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.firstName} {user.lastName} ({user.email})
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </main>
    </div>
  );
}