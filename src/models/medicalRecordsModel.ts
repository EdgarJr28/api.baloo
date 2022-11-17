import { async } from "@firebase/util";
import { fsAnimalCollection } from "../libs/DatabaseRoutes";
import { timestampToDate } from "../libs/functions";

export function setMedicalRecordModel(data: any, universalTime?: boolean,nullfields?:boolean) {
    var model = {
        
            "mid": data.mid,
            "title": data.title || "",
            "date": data.date || "",
            "vetName": data.vetName || "",
            "region": data.region || "",
            "vaccName": data.vaccName || "",
            "comment": data.comment || "",
            "dateCreate": universalTime ? timestampToDate(data.dateCreate) : data.dateCreate,
            "deleted":data.deleted || undefined,
            "type": data.type || ""
        
    }

    if ( nullfields){
        for (const key in model[data.mid]){
            if (model[key]==""){
                model[key]= undefined;   
            }
        }

    }

    return model;
}

export async function getMedicalRecordsCollection(aid: any) {
    return await fsAnimalCollection.doc(aid).collection("medicalRecord");;
}

export  async function getMedicalRecordsCollectionAsObject(aid: any,showdeleted?:any) {

    const profile =   (await getMedicalRecordsCollection(aid)).get();
    var list:any = [];

    (await profile).forEach((v:any)=>{
        const data = setMedicalRecordModel(v.data(),true);
        if ( !data.deleted){
            list.push(data);
        }
        if ( data.deleted&& showdeleted){
            list.push(data);
        }
    })
        
    return list;
    
}