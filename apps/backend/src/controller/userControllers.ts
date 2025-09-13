import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getAppDataSource, User } from "@repo/db";

export const signup = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !firstName || !lastName || !password) {
    return res.json({
      status: 400,
      message: "Please provide with all the records",
    });
  }

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string"
  ) {
    return res.json({
      status: 400,
      message: "Email, password, first name, and last name must be strings.",
    });
  }

  const dataSource = await getAppDataSource();
  const userRepository = dataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await userRepository.findOne({ where: { email } });
  if (existingUser) {
    return res.json({
      status: 499,
      message: "User with this email already exists",
    });
  }

  const newUser = new User();

  newUser.email = email;
  newUser.passwordHash = hashedPassword;
  newUser.firstName = firstName;
  newUser.lastName = lastName;

  await userRepository.save(newUser);

  const token = jwt.sign({ userId: newUser.email }, "super_secret", {
    expiresIn: "1h",
  });
  const { passwordHash, ...otherDetails } = newUser;
  res.json({ status: 200, otherDetails, token });
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      status: 400,
      message: "Please provide with all the fields",
    });
  }
  const dataSource = await getAppDataSource();
  const userRepository = dataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    return res.json({
      status: 499,
      message: "User with this email does not exist",
    });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user!.email }, "super_secret", {
    expiresIn: "1h",
  });

  const { id } = user;
  return res.status(200).json({ token, id });
};
