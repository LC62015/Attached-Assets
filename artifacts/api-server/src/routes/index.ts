import { Router, type IRouter } from "express";
import healthRouter from "./health";
import subscribersRouter from "./subscribers";
import sneakPeeksRouter from "./sneak-peeks";
import newsRouter from "./news";
import projectsRouter from "./projects";
import emailBlastRouter from "./email-blast";

const router: IRouter = Router();

router.use(healthRouter);
router.use(subscribersRouter);
router.use(sneakPeeksRouter);
router.use(newsRouter);
router.use(projectsRouter);
router.use(emailBlastRouter);

export default router;
