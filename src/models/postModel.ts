import { fsAnimalCollection, fsServicesCollection } from "../libs/DatabaseRoutes";
import { profileDefaultIMG, timestampToDate } from "../libs/functions";

export async  function setPostModel(data: any, tofront?: boolean,aData?:any) {

    let uData = {
        "index":data?.index,
        "text": data?.text,
        "profileID": data?.profileID || data?.aid || data?.sid ,
        "pubid":data?.pubid,
        "multimedia": data?.multimedia || profileDefaultIMG,
        "like": data?.like || [],
        "shared": data?.shared || [],
        "deleted": data?.deleted,
        "user": {
            "name": data?.user?.name || aData?.name || "",
            "imgProfile": data?.user?.imgProfile|| aData?.imgProfile || profileDefaultIMG
        },
        "dateCreated": tofront ? timestampToDate(data?.dateCreated) : data?.dateCreated,
        "dateUpdated": tofront ? timestampToDate(data?.dateUpdated) : data?.dateUpdated,
        "pid": data?.pid
    }

    if (tofront) {

        if (!uData.like) {
            uData.like = [];
        }
        if (!uData.shared) {
            uData.shared = [];
        }

        for (const key in uData){
            uData[key]??delete uData[key];
        }   
    } 

    return uData;
}