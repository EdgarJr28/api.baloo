import { Router } from "express";
import { setfollow } from "../controllers/follow";

const router =Router();

router.post("/follow",setfollow);

export default router;
