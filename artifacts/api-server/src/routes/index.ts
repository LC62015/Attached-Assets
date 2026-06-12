import { Router, type IRouter } from "express";
import healthRouter from "./health";
import subscribersRouter from "./subscribers";
import sneakPeeksRouter from "./sneak-peeks";

const router: IRouter = Router();

router.use(healthRouter);
router.use(subscribersRouter);
router.use(sneakPeeksRouter);

export default router;
