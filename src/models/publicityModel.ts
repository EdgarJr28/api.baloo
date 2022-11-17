import { profileDefaultIMG, timestampToDate } from "../libs/functions";

export function setPublicityModel(data:any,tofront?:boolean){

    const mydata={
            "pubid":data?.pubid,
            "profileID":data?.profileID,
            "title":data?.title,
            "multimedia":data?.multimedia,
            "text":data?.text,
            "dateCreated":tofront? timestampToDate(data?.dateCreated):data?.dateCreated,
            "user":{
                "name":data?.user?.name||"",
                "imgProfile":data?.user?.imgProfile||profileDefaultIMG
            }
    }

    return mydata;
}