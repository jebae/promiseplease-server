import { Router } from "express";
import { voteLocationController } from "../controllers";

const {
	findByCityConstituency,
} = voteLocationController;

const router = Router();

router.get("/", findByCityConstituency);

export default router;