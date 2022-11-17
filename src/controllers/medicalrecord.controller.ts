import { Request, Response } from 'express'
import { Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref, remove, set, update } from 'firebase/database';
import { fsAnimalCollection } from '../libs/DatabaseRoutes';
import { getMedicalRecordsCollection, getMedicalRecordsCollectionAsObject, setMedicalRecordModel } from '../models/medicalRecordsModel';
import { returnBadReq, returnNotFound, returnOK, returnServerError } from '../models/returnmodels';
const uniqid = require('uniqid');

export async function createMedicalRecord(req: Request, res: Response): Promise<Response | void> {
    try {
        var aid = req.params.aid;
        var data = req.body;
        var medicalID = uniqid("M-");

        const profileDoc = fsAnimalCollection.doc(aid);

        if (!(await profileDoc.get()).exists) {
            returnNotFound(res, { message: "Perfil no encontrado" });
            return;
        }
        switch (data.type) {
            case "":
                returnBadReq(res, { message: "type cant be empy" })
                return;
                break;
            case "vaccine":
            case "allergy":
            case "proxVaccine":
                break;
            default:
                returnBadReq(res, { message: "type medical  not recognize; only use vaccine,allergy,proxVaccine" })
                return;
                break
        }
        const date = Timestamp.now();
        data = { ...data, mid: medicalID };
        const medicalInput = setMedicalRecordModel(data);
        medicalInput.dateCreate = date;
        const collection = await getMedicalRecordsCollection(aid);
        collection?.doc(medicalID).set(medicalInput);
        returnOK(res, setMedicalRecordModel(medicalInput, true));

    } catch (error: any) {
        returnServerError(res, error)
    }
}
export async function getlistbyAID(req: Request, res: Response): Promise<Response | void> {
    try {
        const aid = req.params.aid;
        const all = req.body.all;
        
        var profile = fsAnimalCollection.doc(aid);

        if (!(await profile.get()).exists) {
            returnNotFound(res, { message: "profile not found" });
            return;
        }

        var collection = await getMedicalRecordsCollectionAsObject(aid,all);

        returnOK(res, collection);

    } catch (error: any) {
        returnServerError(res, error);
    }

}

export async function updateMedicalrecord(req: Request, res: Response) {

    try {
        const aid = req.params.aid;
        const dataInput = req.body;
        switch (dataInput.mid) {
            case undefined:
            case "":
                returnBadReq(res, { message: "mid is empy" });
                return;
        }

        const medicalCollection = await getMedicalRecordsCollection(aid)
        const medicalDocument = medicalCollection.doc(dataInput.mid);
        if (!(await medicalDocument.get()).exists) {
            returnNotFound(res, { message: "medical not found" });
            return;
        }

        medicalDocument.update(dataInput)
        returnOK(res, setMedicalRecordModel(dataInput, true));

    }
    catch (error) {
        returnServerError(res, error);
    }
}

export async function deleteMedicalRecord(req: Request, res: Response) {

    const aid = req.params.aid;
    const dataInput = req.body;
    const mid = req.body.mid;
    switch (mid) {
        case undefined:
        case "":
            returnBadReq(res, { message: "mid is empy" });
            return;
    }

    const medicalCollection = await getMedicalRecordsCollection(aid)
    const medicalDocument = medicalCollection.doc(dataInput.mid);
    if (!(await medicalDocument.get()).exists) {
        returnNotFound(res, { message: "medical not found" });
        return;
    }

    const mdata = setMedicalRecordModel(dataInput, false, true);
    mdata[mid].deleted = true;
    medicalDocument.update(mdata[mid]).then(() => {
        returnOK(res, {});
    }).catch((err) => {
        returnBadReq(res, err);
    });
}

export async function getfromMID(req: Request, res: Response) {

    const aid = req.params.aid;
    const dataInput = req.body;
    const mid = req.body.mid;
    switch (mid) {
        case undefined:
        case "":
            returnBadReq(res, { message: "mid is empy" });
            return;
    }

    const medicalDocument = (await getMedicalRecordsCollection(aid)).doc(mid);
    if (!(await medicalDocument.get()).exists) {
        returnNotFound(res, { message: "medical not found" });
        return;
    }

    try {
        const mdata = setMedicalRecordModel((await medicalDocument.get()).data(), true);
        returnOK(res, mdata);
    } catch (error) {
        returnServerError(res, error);
    }

}