import { Request, Response } from "express";
import { Timestamp } from "firebase-admin/firestore";
import { fsConfigCollection, fsPublicityCollection, fsUserCollection } from "../libs/DatabaseRoutes";
import { getProfileData } from "../libs/functions";
import { getIMGURL } from "../libs/validateImages";
import { setPublicityModel } from "../models/publicityModel";
import { returnBadReq, returnNotFound, returnOK, returnServerError } from "../models/returnmodels";
const uid = require("uniqid")

export async function createPub(req: Request, res: Response) {

    const pubinput = setPublicityModel(req.body);

    const userDoc = getProfileData(pubinput.profileID);

    if (!(await userDoc?.get())?.exists) {
        returnNotFound(res, { message: "Usuario no encontrado" });
        return;
    }

    const userData = (await getProfileData(pubinput.profileID)?.get())?.data();
    const multimedia = await getIMGURL(req.files);

    pubinput.pubid = uid("Pub-");
    pubinput.multimedia = multimedia["multimedia"]||pubinput.multimedia;
    pubinput.dateCreated = Timestamp.now();
    pubinput.user.name= userData?.name;
    pubinput.user.imgProfile = userData?.imgProfile;

    const pubDoc = fsPublicityCollection.doc(pubinput.pubid);
    pubDoc.set(pubinput).catch((err) => {
        returnServerError(res, err);
    }).then((v) => {
        const final = setPublicityModel(pubinput, true);
        returnOK(res, final);
    });
}

export async function getPubList(req: Request, res: Response) {

    const pubInput = setPublicityModel(req.body);

    var publist = await publicityListBuilder();

    returnOK(res, publist);
}

export async function publicityListBuilder() {

    const pubDoc = (await fsPublicityCollection.get()).docs;

    var list: any = [];

    pubDoc.map((v) => {
        var data = setPublicityModel(v.data(), true);
        list.push(data);
    })
    return list;

}

export async function delPubData(req:Request,res:Response) {

    try {
        const pubInput = setPublicityModel(req.body);
        const pubDoc = fsPublicityCollection.doc(pubInput.pubid);
        
    if ( !(await pubDoc.get())?.exists){
            returnBadReq(res,{message:"ID no encontrado"});
            return;
        }
            pubDoc.delete().catch((err)=>{
                returnBadReq(res,err);
            }).then((v)=>{
                returnOK(res,{message:"Publicidad eliminada",});
            })
        
    } catch (error) {
        returnBadReq(res,error);
    }
       
}