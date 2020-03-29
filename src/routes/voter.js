import { Router } from "express";
import { generalInfoController } from "../controllers";

const {
	voterCount,
} = generalInfoController;

const router = Router();

router.get("/count", voterCount);

export default router;