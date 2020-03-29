import { Router } from "express";
import { candidateController } from "../controllers";

const {
	findByCityConstituency,
	count,
	aggregateAge,
} = candidateController;

const router = Router();

router.get("/", findByCityConstituency);
router.get("/count", count);
router.get("/age", aggregateAge);

export default router;