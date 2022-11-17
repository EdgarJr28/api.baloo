

import { profileDefaultIMG, timestampToDate } from "../libs/functions";

export function setServiceModel(datos: any, tofront?: boolean) {

    if (tofront && datos.imgUrl == undefined) {
        datos.imgUrl = "";
    }

    var mymodel = {
        "businessName": datos.businessName,
        "uid": datos.uid,
        "name": datos.name,
        "lastName": datos.lastName,
        "email": datos.email,
        "phone": datos.phone,
        "address": datos.address,
        "city": datos.city,
        "state": datos.state,
        "country": datos.country,
        "specialty": datos.specialty,
        "imgProfile": datos?.imgUrl||datos?.imgProfile,
        "service": datos.service||[],
        "following": datos?.following || [],
        "followers": datos?.followers || [],
        "plan": datos.plan,
        "sid": datos.serviceID || datos.sid,
        "deleted": datos.deleted,
        "suspended": datos.suspended,
        "dateCreated": tofront ? timestampToDate(datos.dateCreated) : datos.dateCreated,
        "dateUpdated": tofront ? timestampToDate(datos.dateUpdated) : datos.dateUpdated
    }
    if (tofront) {

        for (const key in mymodel) {

            if (mymodel[key] == undefined) {
                delete mymodel[key];
            }
        }

        if (mymodel.imgProfile == undefined||mymodel.imgProfile == "" ){
            mymodel.imgProfile=profileDefaultIMG;
        }
    }

    return mymodel;
}