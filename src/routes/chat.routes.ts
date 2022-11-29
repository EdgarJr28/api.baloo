import { Router } from "express";
import { grabarMensaje, obtenerChat } from "../controllers/chat.controller";

const router = Router();

router.post("/chat/get", obtenerChat);


export default router;