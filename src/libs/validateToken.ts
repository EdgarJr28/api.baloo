import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import config from '../config/config'

interface IPayload {
    id: string,
    iat: number,
    exp: number
}

export const tokenValidation = (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.header('auth-token');

        if (!token) return res.status(401).json({ ok: false, status: 'ACCESS DENIED' });
        const payload = jwt.verify(token, process.env.SECRET || config.SECRET) as IPayload;

        console.log(payload);

        req.userId = payload.id;

        next();
    } catch (e : any) { 
        console.log(e.message)
        return res.status(401).json({ ok: false, status: 'ACCESS DENIED' })
    }

}