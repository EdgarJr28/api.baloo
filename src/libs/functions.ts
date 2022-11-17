import { Request, Response } from "express";
import { Timestamp } from "firebase-admin/firestore";
import { serverTimestamp } from "firebase/database";
import { fsAnimalCollection, fsServicesCollection } from "../libs/DatabaseRoutes";
import { setAnimalModelToReturn } from "../models/animalmodel";
import { returnBadReq, returnNotFound, returnOK } from "../models/returnmodels";
import { setServiceModel } from "../models/servicemodel";

export const profileDefaultIMG = "http://app.baloo.pet/uploads/peopleicon.jpeg";
export function sortFullDataAnimal(data: any,) {
  try {
    var followers: any = []
    var following: any = []
    for (let key in data.followers) {
      followers = [...followers, key];
    }
    for (let key in data.following) {
      following = [...following, key];
    }

    const fullData = {
      "adq": data.adq,
      "age": data.age,
      "aid": data.aid,
      "date": data.date,
      "description": data.description,
      "followers": followers,
      "following": following,
      "health_details": data.health_details,
      "match_search": data.match_search,
      "medicalRecords": data.medicalRecords,
      "name": data.name,
      "origin_father": data.origin_father,
      "origin_mother": data.origin_mother,
      "path": data.path,
      "path_pedigree": data.path_pedigree,
      "pedigree": data.pedigree,
      "race": data.race,
      "rol": data.rol,
      "sex": data.sex,
      "species": data.species,
      "uid": data.uid,
      "url": data.url,
      "username": data.username
    }
    return fullData
  } catch (e: any) {
    console.log(Date())
    console.log(e.message)
  }

}

export function timestampToDate(obj: any) {
  var time: any;
  try {
    time = new Timestamp(obj._seconds, obj._nanoseconds).toDate()
  } catch (error) {
    time = undefined
  }
  return time

}

export function getProfileData(profileID: any) {

  if (profileID.includes("A-") && profileID != undefined) {

    return fsAnimalCollection.doc(profileID);

  }

  if (profileID.includes("S-") && profileID != undefined) {
    return fsServicesCollection.doc(profileID);
  }
}

export async function getProfileDataData(req: Request, res: Response) {

  const model = (datos:any)=>{
    const mydata ={
      "profileID": datos.serviceID || datos.sid|| datos?.aid,
      "name": datos.businessName || datos.name ,
      "imgProfile": datos.imgUrl || datos?.imgProfile || profileDefaultIMG,
    }
    return mydata;
  }



  const pid = req.body.profileID
  if (!pid || pid == "") {
    returnBadReq(res, { message: "Error ProfileID not Found" });
    return;
  }
  const profileDoc = await getProfileData(pid)

  if (!(await profileDoc?.get())?.exists) {
    returnNotFound(res, { message: "Profile ID Not Found" });
    return;
  }
  if (pid.includes("A-")) {
    const data = setAnimalModelToReturn((await profileDoc?.get())?.data()).animal;
    returnOK(res, model(data));
    return;
  }

  if (pid.includes("S-")) {
    const data = setServiceModel((await profileDoc?.get())?.data(),true);
    returnOK(res, model(data));
    return;
  }
}