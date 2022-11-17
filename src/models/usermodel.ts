import { database } from "firebase-admin";
import { timestampToDate } from "../libs/functions";

export function setUserModel(data?: any, tofront?: boolean) {

      if (typeof (data?.facebook) == 'string') {
            data.facebook = data?.facebook == "true" ? true : false;
      }
      if (typeof (data?.google) == 'string') {
            data.google = data?.google == "true" ? true : false;
      }
      if (typeof (data?.appleID) == 'string') {
            data.appleID = data?.appleID == "true" ? true : false;
      }

      let mydata = {
            user: {

                  "uid": data?.uid,
                  "username": data?.username,
                  "name": data?.name || "",
                  "lastname": data?.lastname || "",
                  "email": data?.email,
                  "phone": data?.phone || "",
                  "age": data?.age || "",
                  "address": data?.address || "",
                  "country": data?.country || "",
                  "city": data?.city || "",
                  "postal": data?.postal || "",
                  "imgURL": data?.imgURL || "http://app.baloo.pet/uploads/peopleicon.jpeg",
                  "online": data?.online,
                  "deleted": data?.deleted || undefined,
                  "disable": data?.disable || undefined,
                  "facebook": data?.facebook || false,
                  "google": data?.google || false,
                  "appleID": data?.appleID || false,
                  "verifyAccount": data?.verifyAccount,
                  "premium": data?.premium || false,
                  "dateCreate": tofront ? timestampToDate(data?.dateCreate) : data?.dateCreate,
                  "dateUpdate": tofront ? timestampToDate(data?.dateUpdate) : data?.dateUpdate

            },
            token: data?.token,
            // status: data?.status || "",
            message: data?.message || ""
      }

      if (tofront) {
            for (const key in mydata.user) {
                  if (mydata.user[key] == undefined) {
                        delete mydata.user[key];
                  }
            }
            if (mydata.user.imgURL == "") {
                  mydata.user.imgURL = "http://app.baloo.pet/uploads/peopleicon.png";
            }
      }

      return mydata;
}
