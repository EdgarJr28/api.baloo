import { Request, Response } from 'express'
import { apiMedia } from '../config/configProxys';
import { returnBadReq, returnNotFound, returnOK, returnServerError } from '../models/returnmodels';
import uniqid from "uniqid";
import { setStoryModel } from '../models/storyModel';
import { } from '../models/filedirmodel';
import { getIMGURL } from '../libs/validateImages';
import { fsAnimalCollection, fsPostCollection, fsServicesCollection, fsStoryCollection } from '../libs/DatabaseRoutes';
import { Timestamp } from 'firebase-admin/firestore';
import { storyTimeout } from '../config/timeoutTimers';
import { getAnimalFollowingDocument } from './animals.controllers';
import { setAnimalModel } from '../models/animalmodel';
import { getProfileData, profileDefaultIMG } from '../libs/functions';
import { getFollowingsFromProfileDocument } from './follow';
import { returnModel } from '../models/returnmodel';

export async function MediaServer(req: Request, res: Response): Promise<Response | void> {
    apiMedia.get('/media').then(response => {
        console.log(response.data);
        return res.status(200).json(response.data)
    }).catch((err) => {
        returnServerError(res, "Error to connect with media server");
    })
}

export async function createStory(req: Request, res: Response) {

    const stid = uniqid("st-");
    var storydata = setStoryModel(req.body);
    const media = (await getIMGURL(req.files))["storymedia"];
    const date = Timestamp.now();
    var profileData = (await (await getProfileData(storydata.profileID))?.get())?.data();

    const storyCollection = fsStoryCollection.doc(stid);
    storydata.stid = stid;
    storydata.multimedia = media;
    storydata.dateCreated = date;
    storydata.dateUpdate = date;
    // storydata.user.name = await profileData?.name||"";
    storydata.user.imgProfile = await profileData?.imgProfile ?? profileDefaultIMG;

    const final = setStoryModel(storydata, true);

    const model = returnModel({ "type": "story", "id": stid, "timer": storyTimeout });

    try {
        var a = await apiMedia.post("/timeout/set", model);

    } catch (error) {
        returnServerError(res, error);
        return;
    }
    storyCollection.set(storydata).catch((err) => {
        returnBadReq(res, err);
        return;
    }).then((v) => {
        returnOK(res, final);
    })
}

export async function getStorysList(req: Request, res: Response) {

    const storydata = setStoryModel(req.body);
    var animalexist: boolean = false;
    var followingStorys: any = {};
    var stGlobal: any = {}
    var sortedGlobal: any = {};
    var followingIDList: any = [];
    var totalpost: any = {};

    try {

        //get current profileID Data 
        var profileData = await getProfileData(storydata.profileID);

        if (storydata.profileID != undefined && storydata.profileID != "") {

            if ((await profileData?.get())?.exists) {

                const following: any = (await (await getFollowingsFromProfileDocument(storydata.profileID))?.get())?.data();

                if (following != undefined) {
                    Object.keys(following).map((d) => {
                        followingIDList.push(d);
                    })
                }
            }
        }

        //get all Storys from DB
        const storyList = (await fsStoryCollection.get()).docs;
        var i = 0;

        if (storyList.length == 0) {
            returnOK(res, stGlobal);
            return;
        }

        //if story as following or global
        async function setstorymode(story: any) {


            if (followingIDList.find((x: any) => x == story.profileID)) {
                followingStorys.push(story);
            } else {
                stGlobal.push(story);
            }
        }

        storyList.map(async (st) => {
            var story: any = setStoryModel(st.data(), true);
            var id = story.profileID;

            var sto = followingStorys[id] ?? stGlobal[id] ?? [];
            sto.push(story);
            totalpost[id] = sto;

            // totalpost.push(map);
            if (followingIDList.find((x: any) => x == id)) {
                followingStorys[id] = (sto);
            } else {
                stGlobal[id] = (sto);
            }

            i++;

            if (i == storyList.length) {
                Object.keys(stGlobal).map((v) => {
                    sortedGlobal = {...sortedGlobal,[v]:stGlobal[v]}
                })
                Object.keys(followingStorys).map((v) => {
                    sortedGlobal ={...sortedGlobal,[v]:followingStorys[v]};
                })

                var a = JSON.stringify(sortedGlobal);
                returnOK(res, sortedGlobal);
            }
        });
    } catch (error) {
        returnServerError(res, error)
    }
}

export async function getStorysByProfileID(req: Request, res: Response): Promise<Response | void> {

    const profileID = req.body.profileID;
    const animalDoc = await getProfileData(profileID);

    if (!(await animalDoc?.get())?.exists) {
        returnBadReq(res, { message: "perfil no existe" })
        return;
    }
    var storyList: any = []
    const postDoc = await fsStoryCollection.where("profileID", "==", profileID).get();

    var i = 0;
    postDoc.docs.map(async (st) => {
        const tempAnimalData = (await animalDoc?.get())?.data()
        const cst = setStoryModel(st.data(), true, tempAnimalData);
        storyList.push(cst);
        i++;
        if (i == postDoc.size) {
            returnOK(res, storyList);
        }
    });
}

export async function deleteStory(req: Request, res: Response): Promise<Response | void> {

    var id = "";
    if (!req.body.type) {
        id = setStoryModel(req.body).stid;
    } else {
        id = req.body.id;
    }

    const storyDoc = fsStoryCollection.doc(id);

    if (!(await storyDoc.get()).exists) {
        returnNotFound(res, { message: "Story Not Found" });
        return;
    }

    storyDoc.delete().catch((err) => {
        returnBadReq(res, err);
    }).then((v) => {
        returnOK(res, {});
    })
}