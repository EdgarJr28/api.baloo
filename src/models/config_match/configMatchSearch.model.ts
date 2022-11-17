
export function setConfigMatchSearchModel(data?: any) {
    let mydata = {
        aid: data?.aid,
        dataMatch: {
            lugar: data?.place,
            sexo: data?.sex || "",
            edad: data?.age || "",
            personalidad: data?.personality,
            preferencia: data?.preference || "",
            raza: data?.race || "",
            //numero_veces_cruzado: data?.numero_veces_cruzado || "",
            pedigree: data?.pedigree,
        }
    }

    return mydata;
}