import { MixPostData } from "../data/mixpost";
import { IColumnType } from "../models/column_type";

export class MixServices {

    async getMixOrder(): Promise<any[] | undefined>{
        try {
            const respon = await new MixPostData().getColumnTypeHome();
            const list = await this.listeMixP(respon);
            return list;
        } catch (error) {
            throw error;
        }
    }

    async listeMixP(lis: IColumnType[]): Promise<any[]>{
        let newList: any = [];

        for (let i = 0; i < lis.length; i++) {
            if(lis.length != newList.length) {
                const data = await new MixPostData().getColumnsData(lis[i]);
                newList = [...newList, data];
            } else {
                return newList;
            }
        }
        return newList;
    }
}