import { Request, Response } from "express";
import { deleteStory } from "../controllers/storys.controllers";
import { returnModel } from "../models/returnmodel";

export async function mediaReturn(req:Request,res:Response){

    const model = returnModel(req.body);

    switch (model.type) {
        case "story":
            deleteStory(req,res);
            break;
    }

    console.log();
}