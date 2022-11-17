import serviceAccount from '../service-account.json';
import { getFirestore } from 'firebase-admin/firestore';
import * as  admin from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import { initializeAuth } from 'firebase/auth';
import 'firebase/app';
import { initializeApp } from 'firebase/app';

const params = {               //clone json object into new object to make typescript happy
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    apiKey: serviceAccount.apiKey,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url,
    credential: applicationDefault(),
    databaseURL: "https://exalted-mode-338017-default-rtdb.firebaseio.com"

}

console.log("Initialize firebase");
initializeApp(params);
admin.initializeApp({
    credential: admin.credential.cert(params)
})
export const fsRoot = getFirestore();
fsRoot.settings({ ignoreUndefinedProperties: true });

export default async function dbON() {
    const dt = await fsRoot.collection("root").get();
    dt.forEach((data) => {
        console.log(data.id + " => " + data.data()["status"]);
    })
}
