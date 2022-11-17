import { fsAnimalCollection } from "../libs/DatabaseRoutes";
import { getAnimalByID } from "../controllers/animals.controllers";
import { timestampToDate } from "../libs/functions";

export function setFollowModel(id: any, date: any, status: any, animal: any, tofront?: boolean) {
    var myfollow: any =
    {
        [id]: {
            "aid": id,
            "name": animal?.name || animal?.animal?.name || "",
            "imgProfile": animal?.imgProfile || animal?.animal?.imgProfile ||animal?.imgUrl || "",
            "date": date,
            "status": status
        }
    }

    if (tofront) {
        myfollow[id].date = timestampToDate(myfollow[id].date);
    }

    return myfollow;
}

export async function setFollowModelWithTime(obj: any) {
    const animaldata = await getAnimalByID(obj.aid, () => { }, () => { }, true);
    var myfollow = setFollowModel(obj.aid, obj.date, obj.status, animaldata);

    myfollow[obj.aid].date = timestampToDate(myfollow[obj.aid].date);

    return myfollow;
}


export function getAnimalsFollowersDoc(aid: any) {
    return fsAnimalCollection.doc(aid).collection("followList").doc("followers");
}

export function getAnimalsFollowingDoc(aid: any) {
    return fsAnimalCollection.doc(aid).collection("followList").doc("following");

}

export async function getFullFollowList(aid: any, array?: boolean) {
    const followersDoc = (await getAnimalsFollowersDoc(aid).get()).data()
    const followingDoc = (await getAnimalsFollowingDoc(aid).get()).data();

    var ret = {
        "followers": !array ? followersDoc : await convertDocToArray(followersDoc),
        "following": !array ? followingDoc : await convertDocToArray(followingDoc)
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