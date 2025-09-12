import "reflect-metadata";
import express from "express"
import cors from "cors"
import  authRoutes from "./routes/authRoutes"

const app = express()

app.use(cors());
app.use(express.json());


app.use(authRoutes)

export default app;