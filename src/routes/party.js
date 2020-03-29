import { Router } from "express";
import { partyController } from "../controllers";

const {
	countAll
} = partyController;

const router = Router();

router.get("/count", countAll);

export default router;