import { Router } from "express";
import { enviarMensajePrivado } from "../controllers/chat.controller";

const router=Router();

router.post("/chat/mensaje-privado", enviarMensajePrivado);


export default router;