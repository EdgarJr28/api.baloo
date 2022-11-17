export function returnModel(data:any){

    const mymodel = {
        "type":data?.type,
        "id":data?.id,
        "timer":data?.timer
    }
    return mymodel;
}