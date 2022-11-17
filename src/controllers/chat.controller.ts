import { Request, Response } from 'express'
import { returnOK } from '../models/returnmodels';
import Server from '../socket/config/serverSockets';


export async function enviarMensajePrivado(req: Request, res: Response): Promise<Response | void> {
    try {
        const { mensaje, de, id } = req.body;
        const payload = {
            mensaje,
            de
        }
        const server = Server.instance;

        server.io.in(id).emit('mensaje-privado', payload)

        res.json({
            ok: true,
            message: "mensaje enviado",
            payload
        })

    } catch (error: any) {
        console.log(Date());
        console.log(error);
        return res.status(500).json(error.message);
    }
}