import { timestampToDate } from "../libs/functions";

export function adminUserModel(data:any,tofront?:any){

    const mymodel ={
        "uid":data?.uid,
        "username":data?.username,
        "name":data?.name,
        "password":data?.password,
        "email":data?.email,
        "roll":data?.roll||{
            "update":false,
            "write":false,
            "admin":false
        },
        "dateCreated":tofront?timestampToDate(data?.dateCreated):data?.dateCreated||"",
        "token":data?.token||""
    }
return mymodel;

}