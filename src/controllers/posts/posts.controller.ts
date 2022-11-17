import { Request, Response } from 'express'
import uniqid from 'uniqid';
import { getIMGURL } from '../../libs/validateImages';
import { returnBadReq, returnNotFound, returnOK, returnServerError } from '../../models/returnmodels';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { fsAnimalCollection, fsPostCollection, fsServicesCollection } from '../../libs/DatabaseRoutes';
import { setPostModel } from '../../models/postModel';
import { getAnimalFollowingDocument, verifyAnimalExist } from '../animals.controllers';
import { setAnimalModel } from '../../models/animalmodel';
import { AppMainConfig } from '../../libs/configModule';
import { getProfileData } from '../../libs/functions';
import { MixServices } from './services/mix.service';


export async function likePost(req: Request, res: Response) {

    const pid = req.body.pid;
    const profileID = req.body.profileID;

    const postCollection = fsPostCollection.doc(pid);

    if (!(await postCollection.get()).exists) {
        returnBadReq(res, { message: "Post not found" });
        return;
    }

    const postData = await setPostModel((await postCollection.get()).data());
    var result: any = undefined;
    var status = "";
    try {
        if (postData?.like.find((x: any) => x == profileID)) {
            //delete like
            result = postCollection.update({
                "like": FieldValue.arrayRemove(profileID)
            })
            status = "deleted";
        } else {
            //add like 
            result = postCollection.update({
                "like": FieldValue.arrayUnion(profileID)
            })
            status = "add";
        }

        result.catch((err: any) => {
            returnBadReq(res, err);
        }).then((v: any) => {
            returnOK(res, { profileID, status })
        })

    } catch (error) {

    }
}

export async function createPosts(req: Request, res: Response): Promise<Response | void> {
    try {
        // const dbs = getDatabase();
        const postsID = uniqid('p-')
        const token = req.body.token;
        const post = await setPostModel(req.body);
        // get info images
        const paths: any = await getIMGURL(req.files);
        var dateNow = Timestamp.now();
        post.pid = postsID;
        post.dateCreated = dateNow;
        post.dateUpdated = dateNow;
        post.index = (await fsPostCollection.get()).size;
        // var arrayImages: any = { "image0": "" };

        post.multimedia = paths["multimedia"];

        const postColection = fsPostCollection.doc(postsID);

        postColection.set(post).catch((err) => {
            returnBadReq(res, err);
        }).then(async (v) => {

            returnOK(res, await setPostModel(post, true));
        })

    } catch (err) {
        returnServerError(res, err);
    }
}

export async function editPosts(req: Request, res: Response): Promise<Response | void> {

    const postInput = await setPostModel(req.body);

    const postCollection = fsPostCollection.doc(postInput.pid);
    const postData = (await postCollection.get()).data();
    postInput.multimedia = (await getIMGURL(req.files, postData?.multimedia))["multimedia"];
    postInput.dateCreated = postData?.dateCreated;
    delete postInput.like;
    delete postInput.shared;

    postCollection.update(postInput).catch((err) => { returnBadReq(res, err) })
        .then((v) => {
            postInput.dateUpdated = Timestamp.now();
            var final: any = setPostModel(postInput, true);
            // delete final.like;
            // delete final.shared;
            // delete final.user;
            returnOK(res, final);
        })
}

export async function deletePosts(req: Request, res: Response): Promise<Response | void> {

    const pid = req.body.pid;

    const postCollection = fsPostCollection.doc(pid);

    postCollection.update({
        "deleted": true
    }).catch((err) => {
        returnServerError(res, err);
    }).then((v) => {
        returnOK(res, {});
    })
}

// System Navigation Controller 
export async function globalPost(req: Request, res: Response) {

    const args = req.body;
    const aid = args.aid ?? "";
    const all = args.all;
    const postID = args.pid;
    var animalExist: boolean = false;

    var followingIDList: any = [];
    var followingPost: any = [];
    var globalPost: any = [];

    // TODO  organizar los post por fechas 
    const postsList = await (await fsPostCollection.orderBy("dateCreated", "desc").get()).docChanges();
    var followingDoc: any = "";
    if (aid != "" && await verifyAnimalExist(aid, res)) {
        followingDoc = (await getAnimalFollowingDocument(aid).get()).data();
        Object.keys(followingDoc).map((v) => {
            followingIDList.push(v);
        })
        animalExist = true;
    }

    var i = 0;
    var finalpost = await new Promise((res, ras) => {
        var final: any = {};

        // map All Post 
        postsList.map(async (post: any) => {
            var final: any = setPostModel(post.doc.data());

            const animalData = setAnimalModel(await (await fsAnimalCollection.doc(final.aid).get()).data());
            final.user.name = animalData.animal.name;
            final.user.imgProfile = animalData.animal.imgProfile;

            if (!final.deleted && (all == undefined || all == false)) {
                if (followingIDList.find((x: any) => x == final.aid)) {
                    followingPost.push(setPostModel(final, true));
                } else {
                    globalPost.push(setPostModel(final, true));
                }
            }

            if (all == true) {
                if (followingIDList.find((x: any) => x == final.aid)) {
                    followingPost.push(setPostModel(final, true));
                } else {
                    globalPost.push(setPostModel(post.data(), true));
                }
            }

            i++;
            if (i == postsList.length) {
                // post = {followingPost,globalPost }
                final = { following: followingPost, global: globalPost };
                res(final);
            }
        })
    })
    returnOK(res, finalpost);
}
// export async function followingPost(req: Request, res: Response): Promise<Response | void> {
//     postController(1, res, { aid: req.body.aid });
// }
// export async function postGlobalAndFollowing(req: Request, res: Response) {
//     postController(2, res, { aid: req.body.aid });
// }
export async function getPostByID(req: Request, res: Response) {
    // postController(3, res, { pid: req.body.pid });
    const postID = req.body.pid;

    const postColection = fsPostCollection.doc(postID);

    if (!(await postColection.get()).exists) {
        returnNotFound(res, { message: "Post not found" });
        return;
    }
    
    try {
        const postData = await setPostModel((await postColection.get()).data(), true);
        const userdata = (await getProfileData(postData.profileID)?.get())?.data();
        postData.user.name= userdata?.name;
        postData.user.imgProfile = userdata?.imgProfile;

        returnOK(res, postData);

    } catch (error) {
        console.log(error);

    }
}


export async function mixedPost(req: Request, res: Response) {
    const args = req.body;
    const profileID = args.profileID;
    (new MixServices().getMixOrder()).then((c) => {
        returnOK(res, c);
    }).catch((err) => {
        returnServerError(res, err);
    }); 

}


// export async function mixedPost(req: Request, res: Response) {
//     const args = req.body;
//     const profileID = args.profileID ?? "";
//     var profileType;
//     const all = args.all;
//     const postID = args.pid;
//     var profileExist: boolean = false;
//     var followingIDList: any = [];
//     var followingPost: any = [];
//     var publicityPost: any = [];
//     var globalPost: any = [];
//     var finalsort: any = [];

//     // Get following ID fron current animal profile or Service profile 
//     var followingProfileDoc: any = "";

//     if (profileID.includes("A-")) {
//         if (profileID != "" && await verifyAnimalExist(profileID, res)) {
//             followingProfileDoc = (await getAnimalFollowingDocument(profileID).get()).data();

//             if (followingProfileDoc) {
//                 Object.keys(followingProfileDoc).map((v) => {
//                     followingIDList.push(v);
//                 })
//                 profileExist = true;
//             }
//         }
//     }

//     if (profileID.includes("S-")) {
//         if (profileID != "" && await verifyServiceExist(profileID, res)) {
//             followingProfileDoc = (await getServiceFollowingDocument(profileID).get()).data();

//             if (followingProfileDoc) {
//                 Object.keys(followingProfileDoc).map((v) => {
//                     followingIDList.push(v);
//                 })
//                 profileExist = true;
//             }
//         }
//     }

//     async function getuserdata(id: any) {
//         if (id.includes("A-")) {
//             return (await fsAnimalCollection.doc(id).get()).data();
//         }

//         if (id.includes("S-")) {
//             return (await fsServicesCollection.doc(id).get()).data();
//         }
//     }

//     //get all post oder by index
//     const snap = new Promise(async (res, rej) => {
//         var order: any = []
//         var i = 0;
//         var postdoc: any = fsPostCollection.orderBy("index", "desc").onSnapshot((snp) => {
//             snp.docs.map(async (map) => {
//                 var PostData = map.data()

//                 if (!PostData.deleted && (all == undefined || all == false)) {
//                     if (followingIDList.find((x: any) => x == PostData.aid)) {
//                         followingPost.push(await setPostModel(PostData, true));
//                     } else {
//                         globalPost.push(await setPostModel(PostData, true));
//                     }
//                 }

//                 if (all == true) {
//                     if (followingIDList.find((x: any) => x == PostData.aid)) {
//                         followingPost.push(await setPostModel(PostData, true))
//                     } else {
//                         globalPost.push(await setPostModel(PostData, true));
//                     }
//                 }
//                 i++;
//                 if (i == snp.size) {
//                     res(true);
//                 }
//             })
//         })
//     })

//     const postsList: any = await snap;
//     publicityPost = await publicityListBuilder({});
//     const final = await sortingPost({ followingPost, globalPost,publicityPost });

//     returnOK(res, 'final');
//     // console.log();
// }

async function sortingPost(data: any) {

    //TODO: sort data nby index using array 
    const postFollowingSect = AppMainConfig.nNumberFollowingSectView;
    const postGlobalSect = AppMainConfig.nNumberPostGlobalSectView;

    const FollowingPost = data.followingPost;
    const GlobalPost = data.globalPost;
    const pubPost = data.publicityPost;
    const TotalSpins = Object.keys(GlobalPost).length / postGlobalSect;
    const TotalFollowingSpins = FollowingPost.length / postGlobalSect;

    var finalpost: any = [];

    var followingSpin = 0;
    var GlobalSpin = 0;
    var pubPostSpin = 0;

    //------------------- FOLLOWERS POST FILTRER -------------------------------
    var currentFollowsPost = 0;
    function sortFollowingPost() {

        if (followingSpin < TotalFollowingSpins) {

            var currentpost = currentFollowsPost;
            for (currentpost; currentpost < currentFollowsPost + postFollowingSect; currentpost++) {
                const post = FollowingPost[currentpost];
                if (post != undefined) {
                    finalpost.push(post);
                }
            }
            followingSpin++;
        }
    }

    //-------------------------------------------------------------------------

    //------------------- GLOBAL POST FILTRER -------------------------------
    var currentGlobalPost = 0;
    function sortGlobalPost() {

        var currentpost = currentGlobalPost;

        for (currentpost; currentpost < currentGlobalPost + postGlobalSect; currentpost++) {
            const post = GlobalPost[currentpost];

            if (post != undefined) {
                finalpost.push(post)
            }

        }
        currentGlobalPost = currentpost;
    }
    //-------------------------------------------------------------------------

    while (GlobalSpin < TotalSpins) {
        sortFollowingPost();
        sortGlobalPost();

        GlobalSpin++;
    }

    return finalpost;
}

export async function getListPost(req: Request, res: Response) {

    const profile = await setPostModel(req.body);

    const postDoc = (await fsPostCollection.where("profileID", "==", profile.profileID).orderBy("index", "desc").get()).docs;

    var postList: any = [];
    var i = 0;

    postDoc.map(async (post) => {
        var ps = await setPostModel(post.data(), true);
        postList.push(ps);
        i++;
        if (i == postDoc.length) {
            returnOK(res, postList);
        }
    })
    console.log();

}

export async function posttest(req: Request, res: Response) {

    var finals: any = [];

    (await fsPostCollection.orderBy("dateCreated", "desc").get()).docs.map((doc) => {

    })
    returnOK(res, finals);
}

