import { fsConfigCollection } from "../../../libs/DatabaseRoutes";
import { setPublicityModel } from "../../../models/publicityModel";
import { returnServerError } from "../../../models/returnmodels";
import { Response } from 'express'
import { IColumnType } from "../models/column_type";
import { publicityListBuilder } from "../../Publicity";
import { PostData } from "./posts.data";

export class MixPostData {
    constructor() { }


    async getColumnTypeHome(): Promise<IColumnType[]> {
        let colums: IColumnType[] = [];
        return new Promise((resolve, reject) => {
            fsConfigCollection.orderBy('index', 'asc').get().then((doc)=> {
                doc.docs.map((v)=>{
                    if(v.data().type != undefined) {
                        const newColu: IColumnType = {
                            uid: v.id,
                            index: v.data().index,
                            type: v.data().type,
                            quantity: v.data().quantity,
                        }
                        colums = [...colums, newColu];
                    }
                });
                resolve(colums);
            }).catch((err) =>{
                reject(err);
            });
        });
    }


    // Tiempo: Dias de duracion de publicidad
    // Pagos.
    // Tipo de publicidad.(Ad-service, Ad-product, Ad-adopt)



    async getColumnsData(colums: IColumnType): Promise<any[]> {
        let data: any = {};
        return new Promise((resolve, reject) => {
                switch (colums.type) {
                    case 'ad-service':
                        const publicityList = publicityListBuilder();
                        publicityList.then((re) => {
                            data = { type: colums.type, data: re };
                            resolve(data);
                        })
                        break;
                    case 'ad-adopt':
                        const pubAdoptList = publicityListBuilder();
                        pubAdoptList.then((re) => {
                            data = { type: colums.type, data: re };
                            resolve(data);
                        })
                        break;
                    case 'ad-post':
                        const pubPostList = publicityListBuilder();
                        pubPostList.then((re) => {
                            data = { type: colums.type, data: re };
                            resolve(data);
                        })
                        break;
                    case 'post-global':
                        const postGlobalList = new PostData().getPosts(colums.quantity);
                        postGlobalList.then((re) => {
                            data = { type: colums.type, data: re };
                            resolve(data);
                        })
                        break;
                    case 'post-followers':
                        const postFollowersList = new PostData().getPosts(colums.quantity);
                        postFollowersList.then((re) => {
                            data = { type: colums.type, data: re };
                            resolve(data);
                        })
                        break;
                    default:
                }
    
            });
    };
}
