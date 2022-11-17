import { response } from "express";
import { IColumnType } from "../../posts/models/column_type";
import { ConfigsData } from "../data/configs.data";

export class ConfigsServices {
    async createNewColumnTypeHome(newCol: IColumnType) {
        try {
            const resNewColumnDB = await new ConfigsData().createColumnTypeHome(newCol);
            return resNewColumnDB;
        }  catch (error) {
            throw response.status(500).json(error);
        }
    }
}