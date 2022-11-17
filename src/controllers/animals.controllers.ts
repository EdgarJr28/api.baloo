import { Request, Response, NextFunction } from 'express'
import axios from "axios";
import { getDatabase, ref, onValue, update, set, query, orderByChild, equalTo, get, remove } from "firebase/database";
import { getAuth } from 'firebase/auth';
import uniqid from 'uniqid';
import { getIMGURL } from '../libs/validateImages';
import { dirRoot, domain } from '../config/configRoot';
import { verifyFollowAnimal, verifyID, verifyIDAnimal } from '../libs/verifyID';
import { sortFullDataAnimal } from '../libs/functions';
import { returnBadReq, returnConflict, returnNotFound, returnOK, returnServerError } from '../models/returnmodels';
import { fsAnimalCollection, fsAnimalsTypeDB, fsUserCollection } from '../libs/DatabaseRoutes';
import { setAnimalModel, setAnimalModelToReturn } from '../models/animalmodel';
import { Timestamp, FieldValue, FieldPath } from 'firebase-admin/firestore';
import { setUserModel } from '../models/usermodel';
import { convertDocToArray, getAnimalsFollowersDoc, getAnimalsFollowingDoc, getFullFollowList, setFollowModel, setFollowModelWithTime } from '../models/followmodel';
import { setConfigMatchModel } from '../models/config_match/configMatch.model';

export async function getAnimalsFirebase(req: Request, res: Response): Promise<Response | void> {
  try {
    const animalID = req.body.animalID;
    const token = req.body.token;
    const dbs = getDatabase();
    const r = await ref(dbs, `animalsUser/${animalID}`);
    onValue(r, (snapshot) => {
      const data = snapshot.val();
      return res.json(data);
    });
  } catch (error: any) {
    console.log(Date());
    console.log(error);
    res.status(500).json({ message: error.message })
  }

}
export async function getAllAnimals(req: Request, res: Response): Promise<Response | void> {
  try {
    const animalsreference = await fsAnimalCollection.get();
    var animalsList: any = [];
    animalsreference.forEach((obj) => {
      console.log(obj.data());
      animalsList.push(setAnimalModelToReturn(obj.data()));
    })

    returnOK(res, animalsList);

  } catch (error: any) {
    returnServerError(res, error);
  }
}

export async function newAnimal(req: Request, res: Response): Promise<void> {
  try {
    console.log("entro")
    const animalID = uniqid('A-')
    var dateNow = Timestamp.now();
    const paths: any = req.files;
    var animalInput = setAnimalModel(req.body);

    const user = fsUserCollection.doc(req.body.uid);
    if (!(await user.get()).exists) {
      returnBadReq(res, "Usuario No Encontrado");
      return;
    }

    const imgarray: any = await getIMGURL(paths);
    animalInput.animal.aid = animalID;
    animalInput.animal.dateCreate = dateNow;
    animalInput.animal.dateUpdated = dateNow;
    animalInput.animal.imgProfile = imgarray.imgProfile;
    animalInput.animal.pedigreeFile = imgarray.pedigreeFile;

    fsAnimalCollection.doc(animalID).set(animalInput.animal).then((val) => {

      var final = setAnimalModelToReturn(animalInput);

      returnOK(res, final);
    }).catch((err) => {
      returnBadReq(res, err)
    })

  } catch (error: any) {
    console.log(Date());
    console.log(error);
    res.status(500).json({ message: error.message })
  }
}
export async function updateAnimal(req: Request, res: Response): Promise<Response | void> {
  try {
    const aid = req.body.aid;
    const token = req.body.token;
    const animalReference = fsAnimalCollection.doc(aid);

    if (!(await animalReference.get()).exists) {
      returnBadReq(res, "Perfil no encontrado");
      return;
    }


    const animalInfo: any = (await animalReference.get()).data();
    const animalInput: any = setAnimalModel(req.body).animal;
    animalInput.dateCreate = animalInfo.dateCreate;
    delete animalInput.aid;
    delete animalInput.username;
    delete animalInput.pedigreeFile;
    delete animalInput.uid;
    var img = await getIMGURL(req.files, animalInfo.imgProfile);
    if (Object.keys(img).length > 0) {
      animalInput.imgProfile = img["imgProfile"];
    } else {
      delete animalInput.imgProfile;
    }

    animalInput.dateUpdated = Timestamp.now();

    animalReference.update(animalInput).catch((err) => {
      returnBadReq(res, err);
    }).then((v) => {
      returnOK(res, setAnimalModelToReturn(animalInput));
    });

  } catch (error: any) {
    console.log(Date());
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}
export async function pedigreeUpdate(req: Request, res: Response) {

  var pedigree = req.body.pedigree;
  const aid = req.body.aid;
  const file = req.files;
  if (pedigree == "true") {
    pedigree = true;
  } else {
    pedigree = false
  };

  const animalReference = fsAnimalCollection.doc(aid);

  if (!(await animalReference.get()).exists) {
    returnBadReq(res, "Perfil no encontrado");
    return;
  }

  const animaldata = setAnimalModel((await animalReference.get()).data());
  try {

    var fileurl = await getIMGURL(file, animaldata.animal.pedigreeFile);

    if (!pedigree) {
      fileurl = "";
    }

    var data = setAnimalModel({
      pedigree: pedigree,
      pedigreeFile: fileurl.pedigreeFile,
      dateUpdated: Timestamp.now()
    }).animal;
    delete data.imgProfile;
    animalReference.update(data).then((val) => {
      const final = setAnimalModelToReturn(data);
      returnOK(res, final);
    }).catch((err) => {
      returnBadReq(res, err);
    });

  } catch (error) {
    returnServerError(res, error);
  }

}
export async function getAnimalsFromUser(req: Request, res: Response) {
  try {
    const uid = req.body.uid
    const token = req.body.token;

    const animalReference = await fsAnimalCollection.where("uid", "==", uid).get();

    var animales: any = []
    var Animalsize = animalReference.size;
    if (Animalsize == 0) {
      returnOK(res, animales);
      return
    }

    const promise = new Promise((res, err) => {
      var i = 0;
      animalReference.forEach(async (val: any) => {
        var animal: any = setAnimalModelToReturn(val.data());
        const followlist = await getFullFollowList(animal.animal.aid, true);
        animal.animal.following = followlist.following;
        animal.animal.followers = followlist.followers;
        animales.push(animal);
        i++;
        if (i == Animalsize) {
          res(animales);
        }
      })
    })
    promise.then((v) => {
      returnOK(res, animales);
    })
  } catch (error: any) {
    returnServerError(res, error);
  }

}
export async function getAnimalByIDRoute(req: Request, res: Response) {
  const token = req.body.token;
  const aid = req.body.aid;

  getAnimalByID(aid, (resp: any) => {

    returnOK(res, resp);
  },
    (err: any) => {
      returnBadReq(res, err);
    })
}

export async function getAnimalByID(aid: any, res: any, err: any, simply?: boolean) {

  try {
    const animalReference = fsAnimalCollection.doc(aid);

    if (!(await animalReference.get()).exists) {

      err({ message: "Perfil no encontrado" });
      // returnNotFound(res, { message: "Perfil no encontrado" });
      return;
    }
    const animalInfo = setAnimalModelToReturn((await animalReference.get()).data());

    if (!simply) {

      var followlist = await getFullFollowList(aid, true);
      animalInfo.animal.following = (await followlist).following;
      animalInfo.animal.followers = (await followlist).followers;
    }
    // const followings = animalReference.collection("following").get().
    // returnOK(res, animalInfo);
    res(animalInfo);
    return animalInfo;
  } catch (error: any) {
    err(error);
  }
}
export async function deleteAnimalsById(req: Request, res: Response) {
  try {
    const aid = req.body.aid
    const token = req.body.token;
    const animalReference = fsAnimalCollection.doc(aid);

    if (!(await animalReference.get()).exists) {
      returnNotFound(res, "Perfil no encontrado");
      return;
    }
    animalReference.update({
      deleted: true
    }).then((val) => {
      returnOK(res, { message: "Perfil Borrado" });
    }).catch((err) => {
      returnBadReq(res, err);
    })

  } catch (error: any) {
    returnServerError(res, error);
  }
}
export async function getAnimalsTypesFirebase(req: Request, res: Response): Promise<Response | void> {
  try {
    const type = req.body.type ?? null;
    const specie = req.body.specie ?? null;
    const token = req.body.token;

    var list: any = {};

    if (type != null) {
      var value = await (await fsAnimalsTypeDB.doc(type).get()).data();

      list = await value ?? {};
    } else {
      await (await fsAnimalsTypeDB.get()).forEach((v) => {
        const value = v.data();
        list = { ...list, [v.id]: value };
      })
    }

    if (specie != null) {
      list = list[specie] || [];
    }

    returnOK(res, list);

    // const dbs = getDatabase();
    // const r = await ref(dbs, `animales/`);
    // onValue(r, (snapshot) => {
    //   const data = snapshot.val();
    //   let info: any = {};

    //   try {

    //     if (type && specie) {
    //       info = data[type][specie];
    //     } else if (type) {
    //       info = data[type];
    //     } else {
    //       info = data;
    //     }
    //   } catch (error) {
    //     info = undefined;
    //     console.log(error);
    //   }
    //   if (info == undefined) {
    //     return res.status(400).json({ message: "error to get type or specie" })
    //   }
    //   return res.status(200).json(info);
    //   // return res.json(data[type]);
    // });
  } catch (error: any) {
    returnServerError(res, error);
  }

}

export async function AnimalprofileImage(req: Request, res: Response) {
  try {
    // get info images
    const paths: any = req.files;
    const aid = req.body.aid
    const animalReference = fsAnimalCollection.doc(aid);

    if (!(await animalReference.get()).exists) {
      returnBadReq(res, "Usuario no encontrado");
      return;
    }

    const animalData = setAnimalModel((await animalReference.get()).data());

    var arrayImages = await getIMGURL(paths, animalData.animal.imgProfile);
    animalReference.update({
      imgProfile: arrayImages.imgProfile
    }).then((val) => {
      var final = setAnimalModel(arrayImages);
      delete final.animal.pedigreeFile;

      returnOK(res, final);
    }).catch((err) => {
      returnBadReq(res, err);
    })
  }
  catch (e: any) {
    console.log(Date());
    console.log(e);
    return res.status(500).json(e.message);
  }
}

export async function follow(req: Request, res: Response) {

}
// funcion para guardar las configuraciones del match.
export async function saveConfigMatch(req: Request, res: Response) {
  try {
    let config = req.body;
    let aid = config.aid;
    // instanciamos el doc del usuario de firebase.
    const userDoc = fsAnimalCollection.doc(aid);
    // setteamos el modelo de la configuracion
    const data = setConfigMatchModel(config);
    // agregamos la configuracion con la funcion update de firebase
    userDoc.update(data).then(async (val) => {
      if (val) {
        data.message = "animal actualizado";
        returnOK(res, data);
      } else {
        null
      }
    }).catch((err) => {
      returnBadReq(res, err);
    });
  } catch (e: any) {
    returnServerError(res, e);
  }
}

// funcion para editar las configuraciones del match.
export async function editConfigMatch(req: Request, res: Response) {
  try {

    let config = req.body;
    let aid = config.aid;
    // instanciamos el doc del perfil del animal de firebase.
    const animalReference = fsAnimalCollection.doc(aid);
    const configData: any = await animalReference.get()

    if (configData.data()) {
      var configAnimalData = configData.data().config_match
      console.log(configAnimalData)
      if (config.preferencia) {
        configAnimalData.preferencia = config.preferencia;
      }
      if (config.lugar) {
        configAnimalData.lugar = config.lugar;
      }
      if (config.sexo) {
        configAnimalData.sexo = config.sexo;
      }
      if (config.edad) {
        configAnimalData.edad = config.edad;
      }
      if (config.personalidad) {
        configAnimalData.personalidad = config.personalidad;
      }
      if (config.raza) {
        configAnimalData.raza = config.raza;
      }
      if (config.numero_veces_cruzado) {
        configAnimalData.numero_veces_cruzado = config.numero_veces_cruzado;
      }
    }

    // setteamos el modelo de la configuracion
    const data = setConfigMatchModel(configAnimalData);
    // agregamos la configuracion con la funcion update de firebase
    animalReference.update(data).then(async (val) => {
      if (val) {
        data.message = "animal actualizado";
        returnOK(res, data);
      } else {
        null
      }
    }).catch((err) => {
      returnBadReq(res, err);
    });
  } catch (e: any) {
    returnServerError(res, e);
  }
}

// funcion para obtener la configuracion del match.
export async function getConfigMatch(req: Request, res: Response) {
  try {
    let aid = req.body.aid;
    // instanciamos el doc del animal de firebase.
    const animalReference = fsAnimalCollection.doc(aid);
    // validamos la existencia del id.
    if (!(await animalReference.get()).exists) {
      returnBadReq(res, "config not found.");
      return;
    }
    // obtenemos la configuracion con la funcion get de firebase
    animalReference.get().then(async (data: any) => {
      const dataConfig = data.data().config_match
      const modelData = setConfigMatchModel(dataConfig)
      return returnOK(res, modelData)
    }).catch((err) => {
      returnBadReq(res, err);
    });
  } catch (e: any) {
    returnServerError(res, e);
  }
}
export async function verifyAnimalExist(aid: any, res: Response) {

  const animalDoc = fsAnimalCollection.doc(aid);
  if (!(await animalDoc.get()).exists) {
    returnNotFound(res, { message: "Profile not found" });
    return false;
  }
  return true;
}

export function getAnimalFollowingDocument(aid: any) {
  return fsAnimalCollection.doc(aid).collection("followList").doc("following");
}
export function getAnimalFollowersDocument(aid: any) {
  return fsAnimalCollection.doc(aid).collection("followList").doc("followers");
}

