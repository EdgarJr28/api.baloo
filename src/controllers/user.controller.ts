import { Request, Response } from 'express'
import { getDatabase, ref, set, query, orderByChild, equalTo, get, remove } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { getIMGURL } from '../libs/validateImages';
import { fsAnimalCollection, fsServicesCollection, fsStoryCollection, fsUserCollection } from '../libs/DatabaseRoutes';
import { setUserModel } from '../models/usermodel';
import { returnBadReq, returnNotFound, returnOK, returnServerError } from '../models/returnmodels';
import { Timestamp } from 'firebase-admin/firestore';
import { setConfigMatchModel } from '../models/config_match/configMatch.model';

export async function getAllUsers(req: Request, res: Response) {

  try {

    const userCollection = await fsUserCollection.get();
    var final: any = [];

    userCollection.forEach((v) => {
      var user = setUserModel(v.data(), true).user;
      final.push(user);
    })

    returnOK(res, final);

  } catch (error) {
    returnServerError(res, error);
  }
}

export async function getUsersFirebase(req: Request, res: Response): Promise<Response | void> {
  try {

    const uid = req.body.uid;
    const token = req.body.token;

    const userDoc = await fsUserCollection.doc(uid);

    if (!(await userDoc.get()).exists) {
      returnNotFound(res, "usuario no encontrado");
      return;
    }

    const userData = (await userDoc.get());
    const userAnimals = await fsAnimalCollection.where("uid", "==", uid).get();
    const userServices = await fsServicesCollection.where("uid", "==", uid).get();

    var data = userData.data();
    data = setUserModel(data, true);
    data.user.uid = uid;
    data.user = { ...data.user, animalCount: userAnimals.size, servicesCount: userServices.size };
    returnOK(res, data);

  } catch (error: any) {
    console.log(Date());
    console.log(error);
    returnServerError(res, error);
  }

}
export async function updateUserFirebase(req: Request, res: Response): Promise<Response | void> {
  /**
   * 1) get user object 
   * 2) add values to update 
   * 3) validate image
   * 4) upload update 
   */

  const paths: any = req.files;
  const token = req.body.token;
  var dateNow = Date.now();

  try {

    const arrayImages: any = await getIMGURL(paths);
    const userData = setUserModel(req.body).user;
    const userDoc = fsUserCollection.doc(userData.uid);
    userData.imgURL = arrayImages["image"] || arrayImages["imgURL"] || arrayImages["img"] || arrayImages["imgProfile"];
    delete userData.email;
    delete userData.username;
    delete userData.online;
    delete userData.verifyAccount;

    if ((await userDoc.get()).exists) {
      userData.dateUpdate = Timestamp.now();
      userDoc.update(userData).then(async (val) => {
        const u: any = (await userDoc.get()).data();
        const data = setUserModel(u, true);
        data.message = "usuario actualizado";
        returnOK(res, data);
      }).catch((err) => {
        returnBadReq(res, err);
      });
    } else {
      returnNotFound(res, "Usuario no encontrado");
    }

  } catch (error) {
    returnBadReq(res, error);
  }
}
export async function searchUserByID(req: Request, res: Response) {
  try {
    const dbs = getDatabase();
    const username = req.body.username
    const token = req.body.token;
    const r = ref(dbs, `userPerfilDates/`);
    const db = getDatabase();
    const auth = getAuth();

    const list = query(r, ...[orderByChild('username'), equalTo(`${username}`)]);

    get(list).then((response) => {
      // Validate data null
      var data = response.val();
      if (data == null) {
        data = {};
        return res.status(200).json({ user: data });
      }
    });

  } catch (error: any) {
    console.log(Date());
    console.log(error);
    return res.status(500).json(error.message);
  }
}
export async function searchUSerByUserName(req: Request, res: Response) {
  try {
    const dbs = getDatabase();
    const username = req.body.username
    const token = req.body.token;
    const r = ref(dbs, `userPerfilDates/`);
    const db = getDatabase();
    const auth = getAuth();

    const list = query(r, ...[orderByChild('username'), equalTo(`${username}`)]);

    get(list).then((response) => {
      // Validate data null
      var data = response.val();
      if (data == null) {
        data = {};
        return res.status(200).json({ user: data });
      }
      // return res.status(200).json({
      //   message: "Ok",
      //   data: data
      // })
    });

  } catch (error: any) {
    console.log(Date());
    console.log(error);
    return res.status(500).json(error.message)
  }
}

export async function profileImage(req: Request, res: Response) {
  try {

    const paths: any = req.files;
    const uid = req.body.uid;
    let arrayImages: any = await getIMGURL(paths);

    const user = fsUserCollection.doc(uid);
    if ((await user.get()).exists) {

      user.update({
        imgURL: arrayImages["image"] || arrayImages["imgURL"] || arrayImages["img"] || arrayImages["imgProfile"]
      }).then((val) => {
        const user = {
          imgURL: arrayImages["image"] || arrayImages["imgURL"] || arrayImages["img"] || arrayImages["imgProfile"]
        }
        returnOK(res, { user });
      }).catch((err) => {
        returnBadReq(res, err);
      })

    } else {
      returnNotFound(res, "Usuario no encontrado");
    }
  }
  catch (e: any) {
    returnServerError(res, e);
  }
}

export async function deleteUser(req: Request, res: Response) {

  const uid = req.body.uid;

  if (! await verifyUserExist(uid, res)) {
    return;
  }

  const userData = fsUserCollection.doc(uid);
  userData.update({
    "deleted": true
  }).catch((err) => {
    returnBadReq(res, err);
  }).then((v) => {
    returnOK(res, {});
  })
}

export async function clearDataUser(req: Request, res: Response) {
  try {
    const uid = req.body.uid;

    if (! await verifyUserExist(uid, res)) {
      return;
    }
    const userData = fsUserCollection.doc(uid);
    const userStorys = await fsStoryCollection.where("uid", "==", uid).get();
    const userServices = await fsServicesCollection.where("uid", "==", uid).get();
    const userAnimals = await fsAnimalCollection.where("uid", "==", uid).get();
    const data = await userData.get();

    userAnimals.forEach(async (val: any) => {
      if (val) {
        var aid = val.data().aid
        var animal = await fsAnimalCollection.doc(aid).delete();
        console.log(`- User ${uid} Animals  clear.`)
      } else {
        null;
      }
    })
    userStorys.forEach(async (val: any) => {
      if (val) {
        // var sid = val.data().sid
        // var story = await fsAnimalCollection.doc(sid).delete();
        console.log(val.data())
      } else {
        null;
      }
      console.log(`- User ${uid} Storys  clear.`)
    })
    userServices.forEach(async (val: any) => {
      if (val) {
        var sid = val.data().sid
        var service = await fsServicesCollection.doc(sid).delete();
        console.log(`- User ${uid} Services  clear.`)
      } else {
        null
      }
    })

    returnOK(res, { message: "data user clear." })
  } catch (e: any) {
    returnServerError(res, e);
  }
}



export async function verifyUserExist(uid: any, res: Response) {
  try {
    const userdoc = fsUserCollection.doc(uid);

    if (!(await userdoc.get()).exists) {
      returnNotFound(res, { message: "User Not found" });
      return false
    }
    return true;
  } catch (error) {
    returnBadReq(res, error);
    return false;
  }

}
