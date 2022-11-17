import { fsConfigCollection } from "../../../libs/DatabaseRoutes";
import { IColumnType } from "../../posts/models/column_type";

export class ConfigsData {
    constructor() { }
    async getConfigs(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            fsConfigCollection.get().then((doc) => {
                resolve(doc.docs.map((v) => {
                    return {
                        uid: v.id,
                        index: v.data().index,
                        type: v.data().type,
                        quantity: v.data().quantity,
                    }
                }));
            }).catch((err) => {
                reject(err);
            });
        });
    }


    async createColumnTypeHome(newCol: IColumnType) {
        return new Promise((resolve, reject) => {
            fsConfigCollection.doc().create({
                index: newCol.index,
                type: newCol.type,
                quantity: newCol.quantity,
            }).then((doc)=> {
                resolve(doc);
            }).catch((err) =>{
                reject(err);
            });
        });
    }
}