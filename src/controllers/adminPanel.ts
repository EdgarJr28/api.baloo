import { Request, Response } from "express";
import * as  Jwt from "jsonwebtoken";
import * as byc from 'bcryptjs';
import { adminUserModel } from "../models/panelAdminModels";
import { fsAdminPanelUsers, fsUserCollection } from "../libs/DatabaseRoutes";
import { returnBadReq, returnConflict, returnNotFound, returnOK, returnServerError, returnUnauthorized } from "../models/returnmodels";
import { Timestamp } from "firebase-admin/firestore";
import { AppMainConfig, configModel } from "../libs/configModule";
import { getAllAnimals } from "./animals.controllers";

var uid= require("uniqid");

function getToken(data: any) {
    return Jwt.sign(data, AppMainConfig.secretJWT, { expiresIn: '24h' });
}

export async function loginAdmin(req: Request, res: Response) {
    const pass = req.body.password;
    const user = adminUserModel(req.body);

    const userDoc = fsAdminPanelUsers.doc(user.username);
    

    if (!(await userDoc.get()).exists) {
        returnBadReq(res, { message: "Usuario no existe" });
        return;
    }

    const userData = adminUserModel((await userDoc.get()).data());
    const status = await byc.compare(pass, userData.password);

    if (!status) {
        returnUnauthorized(res, { message: "Contraseña incorrecta" });
        return;
    }

    try {
        const token = getToken(userData);
        userData.token = token;
        delete userData.password;
        returnOK(res, adminUserModel(userData, true));

    } catch (error) {
        returnServerError(res, { message: "error intente nuevamente" });
    }
}

export async function signupAdmin(req: Request, res: Response) {

    const pass = req.body.password;
    const user = adminUserModel(req.body);

    if ((await fsAdminPanelUsers.where("username", "==", user.username).get()).size > 0) {

        returnConflict(res, { message: "ya existe un usuario" });
        return;
    }
    try {
        user.uid=uid();
        var token = getToken(user);
        const salt = await byc.genSalt(5);
        user.password = await byc.hash(pass, salt);
        user.dateCreated = Timestamp.now();
        var final = adminUserModel(user, true);
        final.token = token;

        fsAdminPanelUsers.doc(user.username).set(user).catch((err) => {
            returnServerError(res, err);
        }).then((v: any) => {
            delete final.password;
            returnOK(res, final);
        })

    } catch (error) {
        returnServerError(res, { message: "error intente nuevamente" });
    }
}

export async function getAdminUserList(req: Request, res: Response) {

    var final: any = [];
    const usersList = await fsAdminPanelUsers.get()
    usersList.forEach((user) => {
        var userdata = adminUserModel(user.data(), true);
        delete userdata.password;
        final.push(userdata);
    })

    returnOK(res, final);

}

export async function updateAdminUserData(req: Request, res: Response) {

    var userInput = adminUserModel(req.body);
    const userDoc = fsAdminPanelUsers.doc(userInput.username);
    if (!(await userDoc.get()).exists) {
        returnBadReq(res, { message: "Usuario no existe" });
        return;
    }

    const userdata:any = (await userDoc.get()).data();

    Object.keys(userInput).map((val)=>{
        userdata[val]= (userInput[val]!=""||userInput[val]!=undefined)?userInput[val]:undefined;
    })

    if (userInput.password != undefined && userInput.password !=""){
        const salt = await byc.genSalt(5);
        userInput.password = await byc.hash(userInput.password, salt);
    }else{
        delete userInput.password;
    }

    if ( !req.body.roll){
        delete userInput.roll;
    }

    const token = getToken(userInput);
    delete userInput.username;
    userDoc.update(userInput).catch((err) => {
        returnServerError(res, err);
    }).then((v) => {
        userInput.token = token;
        returnOK(res, userInput);
    })
}

export  async function deleteAdminUser(req:Request,res:Response){
const user = adminUserModel(req.body);
const userdoc = fsAdminPanelUsers.doc(user.username);

try {
    
    if (!(await userdoc.get()).exists){
        returnNotFound(res,{message:"Usuario no encontrado"});
        return;
    }
        userdoc.delete().catch((err)=>{
            returnBadReq(res,err);
        }).then((v)=>{
            returnOK(res,{message:"Usuario eliminado"});
        })
} catch (error) {
    returnServerError(res,error);
}

}

export async function getuserinfo(req:Request,res:Response) {
    
    const userInput = adminUserModel(req.body);
    const userDoc = fsAdminPanelUsers.doc(userInput.username);
    if (!(await userDoc.get()).exists){
        returnNotFound(res,{message:"usuario no encontrado"});
        return;
    }

    const userData = adminUserModel((await userDoc.get()).data(),true);
    delete userData.password;
    
    returnOK(res,userData);
}