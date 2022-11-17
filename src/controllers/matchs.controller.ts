import { Request, Response } from 'express'
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase/auth';
import { get, getDatabase, onValue, ref, remove, set, query, orderByChild, equalTo, update } from 'firebase/database';
import uniqid from 'uniqid';
import { fsAnimalCollection, fsUserCollection } from '../libs/DatabaseRoutes';
import { setConfigMatchSearchModel } from '../models/config_match/configMatchSearch.model';
import { getFullMatchList, setMatchModel } from '../models/match.model';
import { returnOK } from '../models/returnmodels';
import { verifyAnimalExist } from './animals.controllers';


export async function getMatchProfiles(req: Request, res: Response): Promise<Response | void> {
    try {
        const configAnimal = setConfigMatchSearchModel(req.body);
        const specie = req.body.specie;
        const animalsDoc = await fsAnimalCollection.where("species", "==", specie).get()
        const allProfilesWithModelSearch: any = [] // array para agregar todos los perfiles con el modelo de configuracion de match de interes.
        const profilesWhitConfigMatches: any = [] // array para agregar los perfiles con el modelo de configuracion igual al buscado.
        // mapeo para organizar la data en el modelo establecido.
        animalsDoc.docs.map(async (st) => {
            const profilesWithModelSearch = setConfigMatchSearchModel(st.data())
            allProfilesWithModelSearch.push(profilesWithModelSearch)
        });

        for (const profile of allProfilesWithModelSearch) {
            if (JSON.stringify(configAnimal.dataMatch) === JSON.stringify(profile.dataMatch)) {
                const dataProfile = fsAnimalCollection.doc(profile.aid)
                // agregamos el perfil de mascota que cumple con la config al array.
                profilesWhitConfigMatches.push((await dataProfile.get()).data())
            }
        }

        return res.json({ data: profilesWhitConfigMatches })

    } catch (error: any) {
        console.log(Date());
        console.log(error);
        return res.status(500).json(error.message);
    }
}

export async function sendMatch(req: Request, res: Response): Promise<Response | void> {
    try {

        var date = Timestamp.now();

        const body = req.body;


        const aid_sender = body.aid_sender; // id del perfil animal que solicita match
        const aid_request = body.aid_request;; // id del perfil que recive la solicitud de match

        var dataSender = undefined;
        var dataRequest = undefined;

        var aid_sender_doc = undefined;
        var aid_request_doc = undefined

        var aid_sender_matched_doc = undefined;
        var aid_request_matched_doc = undefined;

        if (aid_sender.includes("A-")) {
            if (aid_sender != undefined && ! await verifyAnimalExist(aid_sender, res)) {
                return;
            }
            dataSender = fsAnimalCollection.doc(aid_sender);
            aid_sender_doc = getMatchSendedDocument(aid_sender);
            aid_sender_matched_doc = getMatchesDocument(aid_sender);
        }
        if (aid_request.includes("A-")) {
            if (aid_request != undefined && ! await verifyAnimalExist(aid_request, res)) {
                return;
            }
            dataRequest = fsAnimalCollection.doc(aid_request);
            aid_request_doc = getMatchRequestDocument(aid_request);
            aid_request_matched_doc = getMatchesDocument(aid_request);
        }


        const verify = await verifyRequestMatch(aid_sender, aid_request)

        // data match recivido
        let to_match_request = setMatchModel(aid_sender, "", (await dataSender?.get())?.data(), date)
        // data match enviado
        let to_match_sender = setMatchModel(aid_request, " ", (await dataRequest?.get())?.data(), date)
        var senderData = (await aid_sender_doc?.get())?.data();
        var requestData = (await aid_request_doc?.get())?.data();
        var senderMatchData = (await aid_sender_matched_doc?.get())?.data();
        var requestMatchData: any = (await aid_request_matched_doc?.get())?.data();
        if (verify) {
            // host
            if (senderMatchData == undefined) {
                //si no hay datos  crealo
                to_match_request[aid_sender].status = "matched";
                await aid_sender_matched_doc?.set(to_match_sender);
                console.log(aid_request)
                await aid_sender_doc?.delete({
                    [aid_request]: FieldValue.delete()
                })
            } else {
                //si hay lista de datos Actualiza 
                to_match_request[aid_sender].status = "matched";
                await aid_sender_matched_doc?.update(to_match_sender)
                console.log(aid_request)
                await aid_sender_doc?.delete({
                    [aid_request]: FieldValue.delete()
                })
            }

            //process to reques 
            if (requestMatchData == undefined) {
                //si no hay datos  crealo
                await aid_request_matched_doc?.set(to_match_request);
                to_match_sender[aid_request].status = "matched";
                await aid_request_doc?.delete({
                    [aid_sender]: FieldValue.delete()
                })
            } else {
                //si hay lista de datos Actualiza 
                await aid_request_matched_doc?.update(to_match_request)
                to_match_sender[aid_request].status = "matched";
                await aid_request_doc?.delete({
                    [aid_sender]: FieldValue.delete()
                })
            }
            return returnOK(res, to_match_request[aid_sender]);

        }
        else if (senderData == undefined) {
            //si no hay datos  crealo
            await aid_sender_doc?.set(to_match_sender);
            to_match_request[aid_sender].status = "wait";
            console.log("create id");

        } else {
            //si hay lista de datos Actualiza 
            console.log("update id");
            await aid_sender_doc?.update(to_match_sender)
            to_match_request[aid_sender].status = "wait";
        }
        //process to host 
        if (requestData == undefined) {
            //si no hay datos  crealo
            await aid_request_doc?.set(to_match_request);
            to_match_sender[aid_request].status = "wait";
        } else {
            //si hay lista de datos Actualiza 
            console.log("update id");
            await aid_request_doc?.update(to_match_request)
            to_match_sender[aid_request].status = "wait";
        }
        returnOK(res, to_match_request[aid_sender]);
    } catch (e: any) {
        throw res.status(500).json(e.message);
    }


}

export function getMatchSendedDocument(aid: any) {
    return fsAnimalCollection.doc(aid).collection("match").doc("match_sended");
}

export function getMatchRequestDocument(aid: any) {
    return fsAnimalCollection.doc(aid).collection("match").doc("match_request");
}

export function getMatchesDocument(aid: any) {
    return fsAnimalCollection.doc(aid).collection("match").doc("matches");
}


async function verifyRequestMatch(idHost: string, idRequest: string) {
    const verify = await getFullMatchList(idHost, true)
    for (var animal in verify.match_request) {
        if (verify.match_request[animal].aid == idRequest) {
            return true
        }
    }
    return false
}