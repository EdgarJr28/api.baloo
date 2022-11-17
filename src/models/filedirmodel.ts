import * as path from 'path';
import * as fs from 'fs';
import { dirRoot, domain } from '../config/configRoot';


export function renameFileForUser(filename:any,fieldname:any,destination:any,id:any){
    const extension = path.extname(filename);
    const newname = destination+"/"+id+"_"+fieldname+extension;
    var file =  fs.rename(destination+"/"+filename,newname,(err)=>{
        if ( err != null)
        console.log(err);
    });
    return newname;
}