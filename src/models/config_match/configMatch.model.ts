
export function setConfigMatchModel(data?: any) {
    let mydata = {
        uid: data.uid,
        config_match: {
            lugar: data?.lugar,
            sexo: data?.sexo || "",
            edad: data?.edad || "",
            personalidad: data?.personalidad,
            preferencia: data?.preferencia || "",
            raza: data?.raza || "",
            numero_veces_cruzado: data?.numero_veces_cruzado || "",
            pedigree: data?.pedigree || false,
        },
        token: data?.token,
        message: data?.message || ""
    }

    return mydata;
}