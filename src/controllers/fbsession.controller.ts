import { Request, Response } from "express";
import { FacebookAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "firebase/auth";

export  function fblogin(request:Request,response:Response){

    const provider = new FacebookAuthProvider();
    const auth = getAuth();
}