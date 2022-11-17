import { profileDefaultIMG, timestampToDate } from "../libs/functions";

export function setStoryModel(data: any, tofront?: any, aData?: any) {

    var story = {
        "stid": data?.stid,
        "profileID": data?.profileID,
        "text": data?.text || "",
        "multimedia": data?.multimedia,
        "preview": data?.preview,
        "user": {
            "name": aData?.name ?? data?.user?.name ?? "",
            "imgProfile": aData?.imgProfile || data?.user?.imgProfile || profileDefaultIMG
        },
        "dateCreated": tofront ? timestampToDate(data?.dateCreated) : data?.dateCreated,
        "dateUpdate": tofront ? timestampToDate(data?.dateUpdate) : data?.dateUpdate
    }

    // Object.keys(story).map((key)=>{
    //     if ( story[key] == undefined){
    //         delete story[key];
    //     }
    // })

    return story;

}