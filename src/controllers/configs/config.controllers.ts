import { json, Request, Response } from "express";
import { IColumnType } from "../posts/models/column_type";
import { ConfigsServices } from "./services/configs.services";

export async function newColumnTypeHome(req: Request, res: Response): Promise<any> {
    const reqBody = (req.body);
    const newCol: IColumnType = req.body;
    const respNewCol = await new ConfigsServices().createNewColumnTypeHome(newCol);
    console.log(respNewCol);
    return res.status(200).json(respNewCol);
}