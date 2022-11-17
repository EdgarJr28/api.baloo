import { Response } from 'express'
import { getDatabase, ref, get } from "firebase/database";

export async function verifyID(id: string, callback: any): Promise<Response | void> {
    try {
        const dbs = getDatabase();
        const r = ref(dbs, `userPerfilDates/${id}`);
        get(r).then(async (response) => {
            var data = await response.val();
            if (data) {
                callback(true)
            } else {
                callback(false)
            }
        });
    } catch (error: any) {
        console.log(Date());
        console.log(error);
    }
}

export async function verifyIDAnimal(id: string, callback: any): Promise<Response | void> {
    try {
        const dbs = getDatabase();
        const r = ref(dbs, `animalsUser/${id}`);
        get(r).then(async (response) => {
            var data = await response.val();
            if (data) {
                callback(true)
            } else {
                callback(false)
            }
        });
    } catch (error: any) {
        console.log(Date());
        console.log(error);
    }
}

export async function verifyFollowAnimal(id: string, followerAID: string, callback: any): Promise<Response | void> {
    try {
        const dbs = getDatabase();
        const r = ref(dbs, `animalsUser/${id}`);
        const db = ref(dbs, `animalsUser/${id}/followers/${followerAID}`);
        get(db).then(async (response) => {
            var data = await response.val();
            if (data) {
                callback(true)
            } else {
                callback(false)
            }
        });
    } catch (error: any) {
        console.log(Date());
        console.log(error);
    }
}
export async function verifyLike(id: string, postId: string, callback: any): Promise<Response | void> {
    try {
        const dbs = getDatabase();
        const r = ref(dbs, `posts/${postId}/likes/${id}`);
        get(r).then(async (response) => {
            var data = await response.val();
            if (data) {
                callback(true)
            } else {
                callback(false)
            }
            return
        });
    } catch (error: any) {
        console.log(Date());
        console.log(error);

    }
}
export async function verifyStory(id: string, callback: any): Promise<Response | void> {
    try {
        const dbs = getDatabase();
        const r = ref(dbs, `storys/${id}`);
        get(r).then(async (response) => {
            var data = await response.val();
            if (data) {
                callback(true)
            } else {
                callback(false)
            }
            return
        });
    } catch (error: any) {
        console.log(Date());
        console.log(error);

    }
}