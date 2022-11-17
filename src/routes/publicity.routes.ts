import { Router } from "express";
import multer from "multer";
import { createPub, delPubData, getPubList } from "../controllers/Publicity";
import { storageFiles } from "../libs/uploadsImgs";

const pubRoutes = Router();

const storage = multer({storage:storageFiles})

pubRoutes.post("/pub/new",storage.any(),createPub);
pubRoutes.post("/pub/list",getPubList);
pubRoutes.post("/pub/del",delPubData);

export default pubRoutes;