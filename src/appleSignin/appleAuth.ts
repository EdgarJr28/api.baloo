import { Request, Response } from "express";
import { ANDROID_PACKAGE_IDENTIFIER, authAppleKey } from "./AuthConfig";
import * as fs from "fs";
const AppleAuth = require('apple-auth');
const jwt = require("jsonwebtoken");

export async function appleCallBack(req: Request, res: Response) {
    console.log("---------------------- Appple Callback -------------------")
    try {
        console.log(req?.body);
        const redirect = `intent://callback?${new URLSearchParams(
            req.body
        ).toString()}#Intent;package=${ANDROID_PACKAGE_IDENTIFIER
            };scheme=signinwithapple;end`;

        console.log(`Redirecting to ${redirect}`);

        res.redirect(307, redirect);
    } catch (error) {
        console.log(`Callback error: ${error}`);
    }
    console.log("---------------------- -------------------")

}

export async function signInWithApple(req: Request, res: Response) {
    console.log("---------------------- Appple SignIn -------------------")

    try {
        console.log(req?.body);
        const auth = new AppleAuth(
            {
                // use the bundle ID as client ID for native apps, else use the service ID for web-auth flows
                // https://forums.developer.apple.com/thread/118135
                client_id:
                    req.query.useBundleId === "true"
                        ? authAppleKey.BUNDLEID
                        : authAppleKey.SERVICEID,
                team_id: authAppleKey.SERVICEID,
                redirect_uri: authAppleKey.APPLE_REDIRECT_URL, // does not matter here, as this is already the callback that verifies the token after the redirection
                key_id: authAppleKey.KEYID,
            },
            authAppleKey.KEYP8.replace(/\|/g, "\n"),
            "text"
        );

        console.log("--------------------APPLE SIGN IN -------------------");
        
        console.log(req.query);

        const accessToken = await auth.accessToken(req.query.code);
        const idToken = jwt.decode(accessToken.id_token);
        const userID = idToken.sub;
        console.log(idToken);

        // `userEmail` and `userName` will only be provided for the initial authorization with your app
        const userEmail = idToken.email;
        const userName = `${req.query.firstName} ${req.query.lastName}`;

        // 👷🏻‍♀️ TODO: Use the values provided create a new session for the user in your system
        const sessionID = `NEW SESSION ID for ${userID} / ${userEmail} / ${userName}`;

        console.log(`sessionID = ${sessionID}`);

        res.json({ sessionId: sessionID });
    } catch (error) {
        console.log(`signInWithApple error: ${error}`);
    }
    console.log("---------------------- -------------------")

}