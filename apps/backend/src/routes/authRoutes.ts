import { Router, type Request, type Response } from "express";
import { signin, signup } from "../controller/userControllers";

const router  = Router()

router.post("/signup" , signup);
router.post('/signin' , signin)
export default router