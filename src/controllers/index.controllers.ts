import e, { Request, response, Response } from 'express'
import * as Auth from 'firebase/auth';
import { getAuth, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { verifySMS } from '../libs/verifySMS'
import { get, getDatabase, onValue, ref, remove, set, query, orderByChild, equalTo, update } from 'firebase/database';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { validationResult } from 'express-validator';
import { apiMail, apiMedia } from '../config/configProxys';
import { returnOK, returnBadReq, returnConflict, returnNotFound, returnUnauthorized, returnServerError } from '../models/returnmodels';
import { fsAnimalsTypeDB, fsUserCollection } from '../libs/DatabaseRoutes';
import { setUserModel } from '../models/usermodel';
import animals from '../models/animalsTypeDB.json'
import { Timestamp } from 'firebase-admin/firestore';
import { fsRoot } from '../config/config.database';

const getUID = require("uniqid");

export var DEBUG: any = false;
// Endpoints Controllers
export function indexWelcome(req: Request, res: Response): Response {
  console.log("Entro")

  return res.json('Welcome to the Api');
}

export function createDBAnimalsTypes(req: Request, res: Response) {

  const values: any = animals;
  for (const key in values) {
    fsAnimalsTypeDB.doc(key).set(values[key]).then((val) => { }).catch((err) => {
      console.log(err);
    });
  }

  returnOK(res, "ok");

}

export function setDebug(req: Request, resp: Response) {
  if (!DEBUG) {
    DEBUG = true;
    returnOK(resp, { messaje: "DEBUG ON" })
  } else {
    DEBUG = false
    returnOK(resp, { messaje: "DEBUG OFF" })
  }
}

export async function login(req: Request, res: Response): Promise<Response | void> {

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let userInput = {
      email: req.body.email,
      password: req.body.password
    }
    const auth = getAuth();
    const login = await Auth.signInWithEmailAndPassword(auth, userInput.email, userInput.password).then(async response => {
      //const token = await response.user.getIdTokenResult()
      const userResponse = {
        uid: response.user.uid,
        email: response.user.email,
        token: ""
      }
      const userDoc = (fsUserCollection.doc(userResponse.uid));
      let newtoken = jwt.sign({ id: userResponse.uid }, process.env.SECRET || config.SECRET, {
        algorithm: "HS384",
        expiresIn: "30 days",
        jwtid: (userResponse.uid + "-" + userResponse.email)
      })
      await userDoc.update({
        token: newtoken
      })
      var userInfo: any = (await userDoc.get()).data();
      userInfo.token = newtoken;
      userInfo.online = true;
      const fulldata = setUserModel(userInfo, true);
      returnOK(res, fulldata);
    })
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      return returnNotFound(res, {
        code: error.code,
        message: "correo no registrado."
      })
    }
    if (error.code === "auth/wrong-password") {
      return returnBadReq(res, {
        code: error.code,
        message: "Usuario o contraseña incorrectos."
      })
    }
    if (error.code === "auth/too-many-requests") {
      return returnUnauthorized(res, { status: error.code, message: error })
    }
  }
}

export async function signUp(req: Request, res: Response) {

  /** 
   * 1) search on db if username exist 
   * 2) if username not exist, regiser it
   * 3) return user info
  */
  const password = req.body.password;
  const date = Timestamp.now();
  const userinfo = setUserModel(req.body);
  userinfo.user.dateCreate = date;
  userinfo.user.dateUpdate = date;
  userinfo.user.verifyAccount = false;

  try {
    const usercol = fsUserCollection.where("username", "==", userinfo.user.username).get();
    if ((await usercol).size > 0) {

      returnConflict(res, "ya existe un usuario registrado: " + userinfo.user.username);
      return;

    }

    const mailquery = fsUserCollection.where("email", "==", userinfo.user.email).get();
    if ((await mailquery).size > 0) {

      returnConflict(res, "El correo " + userinfo.user.email + " ya se encuentra registrado");
      return;

    }

    const auth = getAuth();

    const signUp = await Auth.createUserWithEmailAndPassword(auth, userinfo.user.email, password).then(response => {
      const user = response.user;
      if (user) {
        userinfo.user.uid = user.uid;

        userinfo.token = jwt.sign({ id: user.uid }, process.env.SECRET || config.SECRET, {
          algorithm: "HS384",
          expiresIn: "30 days",
          jwtid: (user.uid + "-" + user.email)
        })

        const data = fsUserCollection.doc(user.uid);
        data.set(userinfo.user).then((v) => {
          const final = setUserModel(userinfo.user, true);
          final.token = userinfo.token;
          final.message = "Register complete";
          final.user.online = true;
          returnOK(res, final);
          prepareSMS(user.uid, (val: any) => { });
        }).catch((err) => {
          returnBadReq(res, err);
        })
      }
    });

  } catch (error: any) {
    console.log(error);
    if (error.code === "auth/weak-password") {
      returnBadReq(res, {
        status: error.code,
        message: "Contraseña invalida, minimo 8 caracteres."
      })

    } else if (error.code === "auth/email-already-in-use") {

      returnBadReq(res, {
        status: error.code,
        message: "Correo invalido, este correo ya esta en uso."
      })
    }
    else {
      return res.status(401).json({
        status: error.code,
        message: ""
      })
    }
  }
}

export async function signUpExt(req: Request, res: Response) {

  /** 
   * 1) search on db if username exist 
   * 2) if username not exist, regiser it
   * 3) return user info
  */

  const regexemail = /\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;
  const body = req.body;
  const date = Timestamp.now();
  const userinfo = setUserModel();
  userinfo.user.uid = getUID();
  userinfo.user.dateCreate = date;
  userinfo.user.dateUpdate = date;
  userinfo.user.verifyAccount = true;

  try {

    switch (req.params.type) {

      case "google" || "Google":
        userinfo.user.username = body.email.split(regexemail)[0];
        userinfo.user.email = body.email;
        userinfo.user.imgURL = body?.photoUrl;
        userinfo.user.name = body?.displayName;
        userinfo.user.google = true;
        break;
      case "apple" || "Apple":
        userinfo.user.username = body.email.split(regexemail)[0];
        userinfo.user.email = body.email;
        userinfo.user.appleID = true;
        break;
      case "facebook" || "Facebook":
        userinfo.user.username = body.email.split(regexemail)[0];
        userinfo.user.email = body.email;
        userinfo.user.imgURL = body?.picture.data.url;
        userinfo.user.name = body?.name;
        userinfo.user.facebook = true;
        break;
      default:
        returnBadReq(res, { message: "No type was found, use /google, /apple, /facebook" })
        return;
    }

    const usercol = fsUserCollection.where("email", "==", userinfo.user.email).get();
    if ((await usercol).size > 0) {
      //login 
      const data = (await usercol).docChanges()[0].doc.data();

      const userData = setUserModel(data, true);
      userData.token = jwt.sign({ id: userinfo.user.uid }, process.env.SECRET || config.SECRET, {
        algorithm: "HS384",
        expiresIn: "30 days",
        jwtid: (userinfo.user.uid + "-" + userinfo.user.email)
      })
      console.log(userData)
      returnOK(res, userData);
      return;

    }

    //signup
    const data = fsUserCollection.doc(userinfo.user.uid);
    userinfo.token = jwt.sign({ id: userinfo.user.uid }, process.env.SECRET || config.SECRET, {
      algorithm: "HS384",
      expiresIn: "30 days",
      jwtid: (userinfo.user.uid + "-" + userinfo.user.email)
    })

    // const auth = getAuth();
    data.set(userinfo.user).then((v) => {
      const final = setUserModel(userinfo.user, true);
      final.token = userinfo.token;
      final.message = "Register complete";
      final.user.online = true;
      returnOK(res, final);
    })

  } catch (error: any) {
    returnServerError(res, error)
  }
}

export async function loginExt(req: Request, res: Response) {

  const body = req.body;
  const date = Timestamp.now();
  const userinfo = setUserModel();
  userinfo.user.dateCreate = date;
  userinfo.user.dateUpdate = date;
  userinfo.user.verifyAccount = true;

  try {

    switch (req.params.type) {

      case "google" || "Google":
        userinfo.user.email = body.email;
        userinfo.user.imgURL = body?.photoUrl;
        userinfo.user.name = body?.displayName;
        break;
      case "apple" || "Apple":
        break;
      case "facebook" || "Facebook":
        userinfo.user.email = body.email;
        userinfo.user.imgURL = body?.picture.data.url;
        userinfo.user.username = body?.name;
        break;
      default:
        returnBadReq(res, { message: "No type was found, use /google, /apple, /facebook" })
        return;
    }
  } catch (err) {
    returnServerError(res, err);
  }

}
//------------------------ SMS -----------------------------------

async function prepareSMS(uid: any, callbak?: any) {

  /**
   * 1) Generate sms code
   * 2) register sms code on db with UID
   * 3) send sms code to email
   */

  const code = verifySMS();

  const user = await fsUserCollection.doc(uid).get();
  const data = user.data();
  if (user.exists) {
    await fsRoot.collection("verifySMS").doc(uid).set(
      {
        "sms": code
      }
    ).then((res: any) => {
      console.log(res);
      sendEmailSMS(data?.email, code);
      apiMedia.post('/removeSMS', { id: uid }).then(response => { }).catch(error => console.log(error.message));
      callbak(true);
    }).catch((err: any) => {
      console.log(err);
      callbak(false);
    })
  }
}

export async function smsResender(req: Request, res: Response) {
  try {
    const uid = req.body.uid;
    const user = await fsUserCollection.doc(uid).get();
    const data = user.data();
    if (user.exists) {
      await prepareSMS(uid, (val: any) => {
        returnOK(res, { message: "Mensaje enviado" });
      });

    } else {
      returnNotFound(res, { message: "usuario no encontrado" });
    }
  } catch (err: any) {
    console.log(err);
    returnBadReq(res, err);
  }
}

export async function validateSMS(req: Request, res: Response) {
  /**
   * 1)search user on verify collection 
   * 2)compare value with sms input
   * 3)if true? register verify true on user data
   */
  const uid = req.body.uid;
  const sms = req.body.sms.toString();

  try {
    const root = fsRoot.collection("verifySMS").doc(uid);
    const obj = await root.get();
    const user = fsUserCollection.doc(uid);
    if (obj.exists == true) {

      const data = obj.data()

      if (data?.sms == sms) {
        if ((await user.get()).exists) {
          user.update({
            verifyAccount: true
          })
        } else {
          root.delete();
          returnNotFound(res, { message: "user Not found" })
          return;
        }
        root.delete();
        returnOK(res, { message: "Account verify." });

      } else {
        returnBadReq(res, { message: "Code Error" });
      }
    } else {
      returnBadReq(res, { message: "code expired" });
    }
  } catch (error) {
    returnServerError(res, error);
    return;
  }
}

export async function removeSMS(req: Request, res: Response) {
  try {
    const uid = req.body.uid
    const verify = fsRoot.collection("verifySMS").doc(uid);
    if ((await verify.get()).exists) {
      verify.delete();
      console.log("SMS code expired")
    }
    res.status(200).json({ message: 'Proxy ok.' })
  } catch (error) {
    console.log(error);
  }
}

function sendEmailSMS(email: string, code: number) {

  let data = {

    asunto: "Welcome to Baloo , confirm your email to finish register.",
    mail: email,
    message: `<b>Hello your SMS confirmation is ${code}</b> <br> 

      <b> If you didn’t ask to verify this address, you can ignore this email.</b> 
      <br> 
  
      <b> Thanks, - Baloo team </b> 
      `

  }
  apiMail.post('/sendEmail', data).then(response => { }).catch(error => console.log(error.message));
}

//---------------------------------------------------------------------------------------------------------

export function resetPassword(req: Request, res: Response) {
  const auth = getAuth();
  const email = req.body.email;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log('send email to: ' + email);
      return res.status(200).json({ message: "Email send." });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, " ", errorMessage);
      return res.status(400).json({ message: error.message });
    });
}

export async function updatePasswordUser(req: Request, res: Response) {
  const auth = getAuth();
  const a: any = auth.currentUser;
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  updatePassword(a, newPassword).then(() => {

  }).catch((error: any) => {
    console.log(error)
    console.error(error.message);
  });
}

