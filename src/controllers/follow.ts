import { Request, Response } from "express";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { fsAnimalCollection, fsServicesCollection } from "../libs/DatabaseRoutes";
import { getProfileData } from "../libs/functions";
import { setAnimalModel } from "../models/animalmodel";
import { setFollowModel, setFollowModelWithTime } from "../models/followmodel";
import { returnBadReq, returnNotFound, returnOK, returnServerError } from "../models/returnmodels";
import { getAnimalFollowersDocument, getAnimalFollowingDocument, verifyAnimalExist } from "./animals.controllers";
import { getServiceFollowersDocument, getServiceFollowingDocument, verifyServiceExist } from "./services.controllers";

export async function setfollow(req: Request, res: Response) {

    const body = req.body;

    const hostID = body.hostID;
    const clientID = body.clientID;

    var dataHost = undefined;
    var dataClient = undefined;
    var dataHostFollowingDoc = undefined;
    var dataClientFollowedDoc = undefined


    //----------------------------------------------------
    if (hostID.includes("A-")) {
        if (hostID != undefined && ! await verifyAnimalExist(hostID, res)) {
            return;
        }
        dataHost = fsAnimalCollection.doc(hostID);
        dataHostFollowingDoc = getAnimalFollowingDocument(hostID);
    }
    if (hostID.includes("S-")) {

        if (hostID != undefined && ! await verifyServiceExist(hostID, res)) {
            return;
        }

        dataHost = fsServicesCollection.doc(hostID);
        dataHostFollowingDoc = getServiceFollowingDocument(hostID);
    }

    if (clientID.includes("A-")) {
        if (clientID != undefined && ! await verifyAnimalExist(clientID, res)) {
            return;
        }
        dataClient = fsAnimalCollection.doc(clientID);
        dataClientFollowedDoc = getAnimalFollowersDocument(clientID);
    }
    if (clientID.includes("S-")) {
        if (clientID != undefined && ! await verifyServiceExist(clientID, res)) {
            return;
        }
        dataClient = fsServicesCollection.doc(clientID);
        dataClientFollowedDoc = getServiceFollowersDocument(clientID);
    }
    //----------------------------------------------------

    var date = Timestamp.now();

    var tohost = setFollowModel(clientID, date, "", (await dataClient?.get())?.data(), true);
    var toclient = setFollowModel(hostID, date, "", (await dataHost?.get())?.data(), true);
    var clientFollowData = (await dataClientFollowedDoc?.get())?.data();
    var hostFollowData = (await dataHostFollowingDoc?.get())?.data();

    try {
        //proces to client
        if (clientFollowData == undefined) {
            //si no hay datos  crealo
            await dataClientFollowedDoc?.set(toclient);
            toclient[hostID].status = "following";
            console.log("create id");

        } else {

            if (clientFollowData[hostID] == undefined) {
                //si hay lista de datos Actualiza 
                console.log("update id");
                await dataClientFollowedDoc?.update(toclient)
                toclient[hostID].status = "following";

            } else {
                //si el id existe - Eliminalo 
                console.log("eliminar id");
                await dataClientFollowedDoc?.delete({
                    [hostID]: FieldValue.delete()
                })
                toclient[hostID].status = "deleted";
            }
        }

        //process to host 
        if (hostFollowData == undefined) {
            //si no hay datos  crealo
            await dataHostFollowingDoc?.set(tohost);
            tohost[clientID].status = "following";
            console.log("create id");

        } else {

            if (hostFollowData[clientID] == undefined) {
                //si hay lista de datos Actualiza 
                console.log("update id");
                await dataHostFollowingDoc?.update(tohost)
                tohost[clientID].status = "following";

            } else {
                //si el id existe - Eliminalo 
                console.log("eliminar id");
                await dataHostFollowingDoc?.delete({
                    [clientID]: FieldValue.delete()
                })
                tohost[clientID].status = "deleted";
            }
        }

        returnOK(res, tohost[clientID]);

    } catch (error) {
        returnBadReq(res, error);
    }

}

export async function getFollowingsFromProfileDocument(profileID: any) {

    return (await getProfileData(profileID))?.collection("followList").doc("following");
} 
export async function getFollersFromProfileDocument(profileID: any) {

    return (await getProfileData(profileID))?.collection("followList").doc("followers");
}