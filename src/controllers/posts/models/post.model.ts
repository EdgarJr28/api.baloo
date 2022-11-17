import { Timestamp } from "firebase-admin/firestore";

export interface IPost {
    index: number,
    text: string,
    profileID: string,
    pubid: string | undefined,
    multimedia: string,
    like:string[],
    shared: string[],
    deleted: string,
    user: {
        name: string,
        imgProfile: string,
    },
    dateCreated: Timestamp,
    
    dateUpdated: Timestamp,
    pid: string,
}

