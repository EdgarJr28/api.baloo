import { Request, Response } from 'express'
import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref, remove, query, orderByChild, equalTo } from 'firebase/database';
import uniqid from 'uniqid';
import { getIMGURL } from '../libs/validateImages';
import { returnBadReq, returnConflict, returnNotFound, returnOK, returnServerError } from '../models/returnmodels';
import { setServiceModel } from '../models/servicemodel';
import { Timestamp } from 'firebase-admin/firestore';
import { fsServicesCollection, fsUserCollection } from '../libs/DatabaseRoutes';
import { verifyUserExist } from './user.controller';

export async function createService(req: Request, res: Response): Promise<Response | void> {
    try {
        const auth = getAuth();
        const serviceID = uniqid('S-')
        const paths: any = req.files;

        var dateNow = Timestamp.now();
        var arrayImages: any = await getIMGURL(paths);

        const profile = setServiceModel(req.body);
        profile.sid = serviceID;
        profile.imgProfile = arrayImages["imgProfile"];
        profile.dateCreated = profile.dateUpdated = dateNow;
        const final = setServiceModel(profile, true);

        fsServicesCollection.doc(serviceID).set(final).catch((err) => {
            returnConflict(res, err);
        }).then((resp) => {

            returnOK(res, final);
        })

    } catch (error: any) {
        returnServerError(res, error);
    }

}
export async function getServiceList(req: Request, res: Response) {
    try {

        var serviceList: any = [];

        (await fsServicesCollection.get()).docs.map((services) => {
            const service = setServiceModel(services.data(), true);
            serviceList.push(service);
        })

        returnOK(res,serviceList);
    } catch (err) {
        returnServerError(res, err);
    }


}
export async function getService(req: Request, res: Response): Promise<Response | void> {
    try {
        const auth = getAuth();
        const servicesCollection = fsServicesCollection.doc(req.body.sid);

        if (!(await servicesCollection.get()).exists) {
            returnBadReq(res, { message: "profile not found" });
            return;
        }
        await servicesCollection.get().catch((err) => {
            returnBadReq(res, err)
        }).then((value: any) => {
            const data = setServiceModel(value.data(), true);
            returnOK(res, data);
        })

    } catch (error: any) {
        returnServerError(res, error);
    }

}
export async function updateService(req: Request, res: Response): Promise<Response | void> {

    try {
        const auth = getAuth();
        const dbs = getDatabase();
        var profileInput = setServiceModel(req.body);
        var arrayImages: any = await getIMGURL(req.files);
        const servicesCollection = fsServicesCollection.doc(profileInput.sid);

        if (!(await servicesCollection.get()).exists) {
            returnBadReq(res, { message: "Profile not found" });
            return;
        }

        profileInput.dateUpdated = Timestamp.now();
        profileInput.imgProfile = arrayImages["imgProfile"];
        servicesCollection.update(profileInput).catch((err) => {
            returnBadReq(res, err);
        }).then((v) => {
            returnOK(res, setServiceModel(profileInput, true));
        })

    } catch (error: any) {
        returnServerError(res, error);
    }

}
export async function deleteService(req: Request, res: Response): Promise<Response | void> {
    try {

        const serviceDoc = fsServicesCollection.doc(req.body.sid);

        if (!(await serviceDoc.get()).exists) {
            returnBadReq(res, { message: "Profile not found" });
            return;
        }

        const profileData = setServiceModel(req.body);
        profileData.deleted = true;
        profileData.dateUpdated = Timestamp.now();
        serviceDoc.update(profileData).catch((err) => {
            returnServerError(res, err);
        }).then((v) => {
            returnOK(res, {});
        })
    } catch (error: any) {
        returnServerError(res, error);
    }
}
export async function getServiceByUserId(req: Request, res: Response) {
    try {

        const uid = req.body.uid || req.params.uid;
        var showdel = req.body.all;

        if (!await verifyUserExist(uid, res)) {
            return;
        }

        const servicesCollectionQuery = fsServicesCollection.where("uid", "==", uid);
        const data = (await servicesCollectionQuery.get()).docs;
        var final: any = []

        data.forEach((d) => {
            var serviceData = setServiceModel(d.data(), true);
            if (!showdel) {
                if (serviceData.deleted == false || serviceData.deleted == undefined) {
                    final.push(serviceData);
                }
            }

            if (showdel) {
                final.push(serviceData);
            }
        })
        returnOK(res, final);

    } catch (error: any) {
        returnServerError(res, error);
    }
}

export async function verifyServiceExist(sid: any, res: Response) {
    const serviceDoc = fsServicesCollection.doc(sid);
    if (!(await serviceDoc.get()).exists) {
        returnNotFound(res, { message: "Service Not found" });

        return false;
    }
    return true;
}

export function getServiceFollowingDocument(sid: any) {
    return fsServicesCollection.doc(sid).collection("followList").doc("following");
}

export function getServiceFollowersDocument(sid: any) {
    return fsServicesCollection.doc(sid).collection("followList").doc("followers");

}