import { getMatchRequestDocument, getMatchSendedDocument } from "../controllers/matchs.controller";
import { timestampToDate } from "../libs/functions";
import { getAnimalByID } from "../controllers/animals.controllers";

export function setMatchModel(aid: string, status: any, animal: any, date: any, tofront?: boolean) {
    var dataMatch: any =
    {

        [aid]: {
            aid: aid,
            name: animal?.name || animal?.animal?.name || "",
            imgProfile: animal?.imgProfile || animal?.animal?.imgProfile || animal?.imgUrl || "",
            status: status, // status del match
            date: date
        }

    }


    return dataMatch;
}


export async function setFollowModelWithTime(obj: any) {
    const animaldata = await getAnimalByID(obj.aid, () => { }, () => { }, true);
    var myfollow = setMatchModel(obj.aid, obj.date, obj.status, animaldata);

    myfollow[obj.aid].date = timestampToDate(myfollow[obj.aid].date);

    return myfollow;
}

export function setNewAnimalMatchModel() {
    var dataMatch: any =
    {
        match_request: {},
        match_sended: {}
    }

    return dataMatch;
}

export async function getFullMatchList(aid: any, array?: boolean) {
    const followersDoc = (await getMatchSendedDocument(aid).get()).data()
    const followingDoc = (await getMatchRequestDocument(aid).get()).data();

    var ret = {
        "match_sended": !array ? followersDoc : await convertDocToArray(followersDoc),
        "match_request": !array ? followingDoc : await convertDocToArray(followingDoc)
    }

    return ret;
}

export async function convertDocToArray(obj: any) {
    var array: any = []

    for (const key in obj) {
        var data = await setFollowModelWithTime(obj[key]);
        array.push(data[key]);
    }
    return array;
}