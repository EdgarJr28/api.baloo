import { Request, Response } from 'express'
import { fsChatsCollection } from '../libs/DatabaseRoutes';
import { returnConflict, returnOK } from '../models/returnmodels';
import uniqid from 'uniqid';
import Server from '../socket/config/serverSockets';
import { Timestamp } from 'firebase-admin/firestore';


export async function grabarMensaje(payload: any): Promise<Response | void> {
    try {
        const time = Timestamp.now()
        const { de, para, mensaje } = payload;
        const newChat = {
            id: uniqid('Message'),
            de: de,
            para: para,
            mensaje: mensaje,
            time: time
        }

        await fsChatsCollection.doc(de).collection(para).doc(newChat.id).set(newChat).catch((err) => {
            console.error(err);
        }).then(async (r) => {
            if (r)
                fsChatsCollection.doc(para).collection(de).doc(newChat.id).set(newChat).catch((err) => {
                    console.error(err);
                })
        })

    } catch (e: any) {
        console.log(Date());
        console.log(e.message);
    }
}

export async function obtenerChat(req: Request, res: Response): Promise<Response | void> {
    try {
        const { id, other } = req.body;
        const meChatCollection = getChatDocument(id, other);
        const sended = await meChatCollection.where("de", "==", id).get()
        const received = await meChatCollection.where("de", "==", other).get()
        const meMessages: any = []
        const otherMessages: any = []
        sended.docs.map((smg) => {
            const message = smg.data()
            meMessages.push(message)
        });
        received.docs.map((smg) => {
            const message = smg.data()
            otherMessages.push(message)
        });
        return res.status(200).json({ meMessages, otherMessages })
    } catch (e: any) {
        console.log(Date());
        console.log(e.message);
        throw res.status(500).json(e.message);
    }

}

export function getChatDocument(id: string, other: string) {
    return fsChatsCollection.doc(id).collection(other);
}