import { Router } from "express";
import { appleCallBack, signInWithApple } from "../appleSignin/appleAuth";

const AppleRoute= Router();

AppleRoute.post("/callback/sign_in_with_apple",appleCallBack);
AppleRoute.post("/sign_in_with_apple",signInWithApple)
export default AppleRoute;