import "reflect-metadata";
import express from "express"
import cors from "cors"
import authRoutes from "./routes/authRoutes"
import workflowRoutes from "./routes/workflowRoutes"

const app = express()

app.use(cors());
app.use(express.json());


app.use(authRoutes)
app.use(workflowRoutes)

export default app;