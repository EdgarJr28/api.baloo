import { json, Request, response, Response } from 'express';

export async function errorValidation(e: any, res: Response): Promise<Response | void> {
    console.log(Date() + "\n Error -> " + e.message);
    res.status(400).json({ ok: false, error: e.code, message: e.message });
}

export async function errorValidationSockets(e: any, res: Response): Promise<Response | void> {
    console.log(Date() + "\n Error -> " + e.message);
    return res.status(400).json({ ok: false, error: e.code, message: e.message });
}