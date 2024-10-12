import { Router } from "express";
import userRouter from './users.mjs';

const router = Router();

// all routers here
router.use(userRouter);

export default router;