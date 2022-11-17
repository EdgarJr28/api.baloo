import { Timestamp } from "firebase-admin/firestore";
import { profileDefaultIMG, timestampToDate } from "../libs/functions";
import { setNewAnimalMatchModel } from "./match.model";

export function setAnimalModel(data?: any) {

    // if (data == undefined) {
    //     const empy: any = setAnimalModel({
    //         aid: "id error,not exist",
    //         name: "id error, not exist",
    //         username: "id error, not exist"
    //     });
    //     console.log(empy);

    //     return empy
    // }

    var pedigree = data?.pedigree ?? data?.animal?.pedigree;
    var match_search = data?.match_search ?? data?.animal?.match_search;

    if (typeof (pedigree) == "string") {
        if (pedigree == "true") {
            pedigree = true;
        } else {
            pedigree = false;
        }
    }

    if (typeof (match_search) == "string") {
        if (match_search == "true") {
            match_search = true;
        } else {
            match_search = false;
        }
    }


    const myanimal = {
        animal: {
            "aid": data?.aid,
            "imgProfile": data?.imgProfile || "",
            "username": data?.username,
            "name": data?.name,
            "race": data?.race,
            "sex": data?.sex,
            "age": data?.age,
            "place": data?.place,
            "health_details": data?.health_details,
            "origin_father": data?.origin_father,
            "origin_mother": data?.origin_mother,
            "pedigreeFile": data?.pedigreeFile || "",
            "pedigree": pedigree,
            "species": data?.species,
            "description": data?.description,
            "match_search": match_search,
            "adq": data?.adq,
            "rol": data?.rol,
            "uid": data?.uid,
            "following": data?.following || [],
            "followers": data?.followers || [],
            "matchs": setNewAnimalMatchModel(),
            "deleted": data?.deleted || undefined,
            "disabled": data?.disable || undefined,
            "dateCreate": data?.dateC || data?.dateCreate,
            "dateUpdated": data?.dateU || data?.dateUpdated
        },
        // status: "",
        message: ""
    }
    return myanimal;
}

export function setAnimalModelToReturn(data: any) {
    var myanimal: any = setAnimalModel(data?.animal || data);
    myanimal.animal.dateCreate = timestampToDate(myanimal.animal.dateCreate);
    myanimal.animal.dateUpdated = timestampToDate(myanimal.animal.dateUpdated);
    for (const key in myanimal.animal) {
        if (myanimal.animal[key] == undefined) {
            myanimal.animal[key] = "";
        }
    }
    if (myanimal.animal.imgProfile == "") {
        myanimal.animal.imgProfile = profileDefaultIMG;
    }

    // var followin = [];
    // myanimal.animal.followin.forEach((val:any)=>{
    //     followin.push(val);
    // })

    return myanimal;
}