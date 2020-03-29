import { Router } from "express";
import candidateRouter from "./candidate";
import electionPromiseRouter from "./electionPromise";
import partyRouter from "./party";
import voteLocationRouter from "./voteLocation";
import voterRouter from "./voter";
import wordRouter from "./word";

const router = Router();

router.use("/candidate", candidateRouter);
router.use("/promise", electionPromiseRouter);
router.use("/party", partyRouter);
router.use("/vote-location", voteLocationRouter);
router.use("/voter", voterRouter);
router.use("/word", wordRouter);

export default router;