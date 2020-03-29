import { Router } from "express";
import { electionPromiseController } from "../controllers";

const {
	count,
} = electionPromiseController;

const router = Router();

router.get("/count", count);

export default router;