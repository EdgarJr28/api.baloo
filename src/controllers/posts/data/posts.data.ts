import { fsPostCollection } from "../../../libs/DatabaseRoutes";
import { setPostModel } from "../../../models/postModel";
import { IPost } from "../models/post.model";

export class PostData {


    async getPosts(limit: number): Promise<any[]> {
        let posts: any[] = [];
        return new Promise((resolve, reject) => {
            fsPostCollection.orderBy('dateCreated', 'desc').limit(limit).get().then((doc) => {
                doc.docs.map(async (v) => {
                    const myPost = v.data(); 
                    posts = [...posts, myPost];
                });
                resolve(posts);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}