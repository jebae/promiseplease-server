import { Router } from "express";
import { wordController } from "../controllers";

const {
	search,
} = wordController;

const router = Router();

router.get("/", search);

export default router;