import { fsRoot } from "../config/config.database";
import { updateindex } from "./Test";

export var AppMainConfig: any ;
const configColl = fsRoot.collection("config");
export const configDoc = configColl.doc("config");

export function configModel(data?: any) {

    const mydata = {
        "npostGlobal": data?.npost || 0,
        "maxpostview": data?.maxpostview || 20,
        "nNumberFollowingSectView": data?.nNumberFollowingSectView || 3,
        "nNumberPostGlobalSectView": data?.nNumberPostGlobalSectView || 3,
        "nNumberPubSectView": data?.nNumberPubSectView || 1,
        "secretJWT":data?.secretJWT||"35jgg@#$^dfjn2VY&^2"
    }

    return mydata;
}

export async function perareConfig(data?: any) {
    console.log("Reading Settings");

    updateindex();
    if ((await configColl.get()).empty) {
        console.log("config empy");
        configDoc.set(configModel()).then((v:any) => {
            AppMainConfig = configModel();
            console.log("save default config on db");

        });
    } else {
        AppMainConfig = configModel((await configDoc.get()).data());
        console.log("all Settings Readed");
    }
}
