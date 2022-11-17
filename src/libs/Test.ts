import { request, response } from "express";
import { signInWithApple } from "../appleSignin/appleAuth";
import { fsRoot } from "../config/config.database";
import { setPostModel } from "../models/postModel";
import { fsAnimalCollection, fsServicesCollection } from "./DatabaseRoutes";

export async function updateindex() {

    
}