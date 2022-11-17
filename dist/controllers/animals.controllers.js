"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimalFollowersDocument = exports.getAnimalFollowingDocument = exports.verifyAnimalExist = exports.getConfigMatch = exports.editConfigMatch = exports.saveConfigMatch = exports.follow = exports.AnimalprofileImage = exports.getAnimalsTypesFirebase = exports.deleteAnimalsById = exports.getAnimalByID = exports.getAnimalByIDRoute = exports.getAnimalsFromUser = exports.pedigreeUpdate = exports.updateAnimal = exports.newAnimal = exports.getAllAnimals = exports.getAnimalsFirebase = void 0;
const database_1 = require("firebase/database");
const uniqid_1 = __importDefault(require("uniqid"));
const validateImages_1 = require("../libs/validateImages");
const returnmodels_1 = require("../models/returnmodels");
const DatabaseRoutes_1 = require("../libs/DatabaseRoutes");
const animalmodel_1 = require("../models/animalmodel");
const firestore_1 = require("firebase-admin/firestore");
const followmodel_1 = require("../models/followmodel");
const configMatch_model_1 = require("../models/config_match/configMatch.model");
function getAnimalsFirebase(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const animalID = req.body.animalID;
            const token = req.body.token;
            const dbs = (0, database_1.getDatabase)();
            const r = yield (0, database_1.ref)(dbs, `animalsUser/${animalID}`);
            (0, database_1.onValue)(r, (snapshot) => {
                const data = snapshot.val();
                return res.json(data);
            });
        }
        catch (error) {
            console.log(Date());
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    });
}
exports.getAnimalsFirebase = getAnimalsFirebase;
function getAllAnimals(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const animalsreference = yield DatabaseRoutes_1.fsAnimalCollection.get();
            var animalsList = [];
            animalsreference.forEach((obj) => {
                console.log(obj.data());
                animalsList.push((0, animalmodel_1.setAnimalModelToReturn)(obj.data()));
            });
            (0, returnmodels_1.returnOK)(res, animalsList);
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.getAllAnimals = getAllAnimals;
function newAnimal(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("entro");
            const animalID = (0, uniqid_1.default)('A-');
            var dateNow = firestore_1.Timestamp.now();
            const paths = req.files;
            var animalInput = (0, animalmodel_1.setAnimalModel)(req.body);
            const user = DatabaseRoutes_1.fsUserCollection.doc(req.body.uid);
            if (!(yield user.get()).exists) {
                (0, returnmodels_1.returnBadReq)(res, "Usuario No Encontrado");
                return;
            }
            const imgarray = yield (0, validateImages_1.getIMGURL)(paths);
            animalInput.animal.aid = animalID;
            animalInput.animal.dateCreate = dateNow;
            animalInput.animal.dateUpdated = dateNow;
            animalInput.animal.imgProfile = imgarray.imgProfile;
            animalInput.animal.pedigreeFile = imgarray.pedigreeFile;
            DatabaseRoutes_1.fsAnimalCollection.doc(animalID).set(animalInput.animal).then((val) => {
                var final = (0, animalmodel_1.setAnimalModelToReturn)(animalInput);
                (0, returnmodels_1.returnOK)(res, final);
            }).catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            });
        }
        catch (error) {
            console.log(Date());
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    });
}
exports.newAnimal = newAnimal;
function updateAnimal(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const aid = req.body.aid;
            const token = req.body.token;
            const animalReference = DatabaseRoutes_1.fsAnimalCollection.doc(aid);
            if (!(yield animalReference.get()).exists) {
                (0, returnmodels_1.returnBadReq)(res, "Perfil no encontrado");
                return;
            }
            const animalInfo = (yield animalReference.get()).data();
            const animalInput = (0, animalmodel_1.setAnimalModel)(req.body).animal;
            animalInput.dateCreate = animalInfo.dateCreate;
            delete animalInput.aid;
            delete animalInput.username;
            delete animalInput.pedigreeFile;
            delete animalInput.uid;
            var img = yield (0, validateImages_1.getIMGURL)(req.files, animalInfo.imgProfile);
            if (Object.keys(img).length > 0) {
                animalInput.imgProfile = img["imgProfile"];
            }
            else {
                delete animalInput.imgProfile;
            }
            animalInput.dateUpdated = firestore_1.Timestamp.now();
            animalReference.update(animalInput).catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            }).then((v) => {
                (0, returnmodels_1.returnOK)(res, (0, animalmodel_1.setAnimalModelToReturn)(animalInput));
            });
        }
        catch (error) {
            console.log(Date());
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    });
}
exports.updateAnimal = updateAnimal;
function pedigreeUpdate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var pedigree = req.body.pedigree;
        const aid = req.body.aid;
        const file = req.files;
        if (pedigree == "true") {
            pedigree = true;
        }
        else {
            pedigree = false;
        }
        ;
        const animalReference = DatabaseRoutes_1.fsAnimalCollection.doc(aid);
        if (!(yield animalReference.get()).exists) {
            (0, returnmodels_1.returnBadReq)(res, "Perfil no encontrado");
            return;
        }
        const animaldata = (0, animalmodel_1.setAnimalModel)((yield animalReference.get()).data());
        try {
            var fileurl = yield (0, validateImages_1.getIMGURL)(file, animaldata.animal.pedigreeFile);
            if (!pedigree) {
                fileurl = "";
            }
            var data = (0, animalmodel_1.setAnimalModel)({
                pedigree: pedigree,
                pedigreeFile: fileurl.pedigreeFile,
                dateUpdated: firestore_1.Timestamp.now()
            }).animal;
            delete data.imgProfile;
            animalReference.update(data).then((val) => {
                const final = (0, animalmodel_1.setAnimalModelToReturn)(data);
                (0, returnmodels_1.returnOK)(res, final);
            }).catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            });
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.pedigreeUpdate = pedigreeUpdate;
function getAnimalsFromUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uid = req.body.uid;
            const token = req.body.token;
            const animalReference = yield DatabaseRoutes_1.fsAnimalCollection.where("uid", "==", uid).get();
            var animales = [];
            var Animalsize = animalReference.size;
            if (Animalsize == 0) {
                (0, returnmodels_1.returnOK)(res, animales);
                return;
            }
            const promise = new Promise((res, err) => {
                var i = 0;
                animalReference.forEach((val) => __awaiter(this, void 0, void 0, function* () {
                    var animal = (0, animalmodel_1.setAnimalModelToReturn)(val.data());
                    const followlist = yield (0, followmodel_1.getFullFollowList)(animal.animal.aid, true);
                    animal.animal.following = followlist.following;
                    animal.animal.followers = followlist.followers;
                    animales.push(animal);
                    i++;
                    if (i == Animalsize) {
                        res(animales);
                    }
                }));
            });
            promise.then((v) => {
                (0, returnmodels_1.returnOK)(res, animales);
            });
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.getAnimalsFromUser = getAnimalsFromUser;
function getAnimalByIDRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.body.token;
        const aid = req.body.aid;
        getAnimalByID(aid, (resp) => {
            (0, returnmodels_1.returnOK)(res, resp);
        }, (err) => {
            (0, returnmodels_1.returnBadReq)(res, err);
        });
    });
}
exports.getAnimalByIDRoute = getAnimalByIDRoute;
function getAnimalByID(aid, res, err, simply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const animalReference = DatabaseRoutes_1.fsAnimalCollection.doc(aid);
            if (!(yield animalReference.get()).exists) {
                err({ message: "Perfil no encontrado" });
                return;
            }
            const animalInfo = (0, animalmodel_1.setAnimalModelToReturn)((yield animalReference.get()).data());
            if (!simply) {
                var followlist = yield (0, followmodel_1.getFullFollowList)(aid, true);
                animalInfo.animal.following = (yield followlist).following;
                animalInfo.animal.followers = (yield followlist).followers;
            }
            res(animalInfo);
            return animalInfo;
        }
        catch (error) {
            err(error);
        }
    });
}
exports.getAnimalByID = getAnimalByID;
function deleteAnimalsById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const aid = req.body.aid;
            const token = req.body.token;
            const animalReference = DatabaseRoutes_1.fsAnimalCollection.doc(aid);
            if (!(yield animalReference.get()).exists) {
                (0, returnmodels_1.returnNotFound)(res, "Perfil no encontrado");
                return;
            }
            animalReference.update({
                deleted: true
            }).then((val) => {
                (0, returnmodels_1.returnOK)(res, { message: "Perfil Borrado" });
            }).catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            });
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.deleteAnimalsById = deleteAnimalsById;
function getAnimalsTypesFirebase(req, res) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const type = (_a = req.body.type) !== null && _a !== void 0 ? _a : null;
            const specie = (_b = req.body.specie) !== null && _b !== void 0 ? _b : null;
            const token = req.body.token;
            var list = {};
            if (type != null) {
                var value = yield (yield DatabaseRoutes_1.fsAnimalsTypeDB.doc(type).get()).data();
                list = (_c = yield value) !== null && _c !== void 0 ? _c : {};
            }
            else {
                yield (yield DatabaseRoutes_1.fsAnimalsTypeDB.get()).forEach((v) => {
                    const value = v.data();
                    list = Object.assign(Object.assign({}, list), { [v.id]: value });
                });
            }
            if (specie != null) {
                list = list[specie] || [];
            }
            (0, returnmodels_1.returnOK)(res, list);
        }
        catch (error) {
            (0, returnmodels_1.returnServerError)(res, error);
        }
    });
}
exports.getAnimalsTypesFirebase = getAnimalsTypesFirebase;
function AnimalprofileImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paths = req.files;
            const aid = req.body.aid;
            const animalReference = DatabaseRoutes_1.fsAnimalCollection.doc(aid);
            if (!(yield animalReference.get()).exists) {
                (0, returnmodels_1.returnBadReq)(res, "Usuario no encontrado");
                return;
            }
            const animalData = (0, animalmodel_1.setAnimalModel)((yield animalReference.get()).data());
            var arrayImages = yield (0, validateImages_1.getIMGURL)(paths, animalData.animal.imgProfile);
            animalReference.update({
                imgProfile: arrayImages.imgProfile
            }).then((val) => {
                var final = (0, animalmodel_1.setAnimalModel)(arrayImages);
                delete final.animal.pedigreeFile;
                (0, returnmodels_1.returnOK)(res, final);
            }).catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            });
        }
        catch (e) {
            console.log(Date());
            console.log(e);
            return res.status(500).json(e.message);
        }
    });
}
exports.AnimalprofileImage = AnimalprofileImage;
function follow(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.follow = follow;
function saveConfigMatch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let config = req.body;
            let aid = config.aid;
            const userDoc = DatabaseRoutes_1.fsAnimalCollection.doc(aid);
            const data = (0, configMatch_model_1.setConfigMatchModel)(config);
            userDoc.update(data).then((val) => __awaiter(this, void 0, void 0, function* () {
                if (val) {
                    data.message = "animal actualizado";
                    (0, returnmodels_1.returnOK)(res, data);
                }
                else {
                    null;
                }
            })).catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            });
        }
        catch (e) {
            (0, returnmodels_1.returnServerError)(res, e);
        }
    });
}
exports.saveConfigMatch = saveConfigMatch;
function editConfigMatch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let config = req.body;
            let aid = config.aid;
            const animalReference = DatabaseRoutes_1.fsAnimalCollection.doc(aid);
            const configData = yield animalReference.get();
            if (configData.data()) {
                var configAnimalData = configData.data().config_match;
                console.log(configAnimalData);
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
            const data = (0, configMatch_model_1.setConfigMatchModel)(configAnimalData);
            animalReference.update(data).then((val) => __awaiter(this, void 0, void 0, function* () {
                if (val) {
                    data.message = "animal actualizado";
                    (0, returnmodels_1.returnOK)(res, data);
                }
                else {
                    null;
                }
            })).catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            });
        }
        catch (e) {
            (0, returnmodels_1.returnServerError)(res, e);
        }
    });
}
exports.editConfigMatch = editConfigMatch;
function getConfigMatch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let aid = req.body.aid;
            const animalReference = DatabaseRoutes_1.fsAnimalCollection.doc(aid);
            if (!(yield animalReference.get()).exists) {
                (0, returnmodels_1.returnBadReq)(res, "config not found.");
                return;
            }
            animalReference.get().then((data) => __awaiter(this, void 0, void 0, function* () {
                const dataConfig = data.data().config_match;
                const modelData = (0, configMatch_model_1.setConfigMatchModel)(dataConfig);
                return (0, returnmodels_1.returnOK)(res, modelData);
            })).catch((err) => {
                (0, returnmodels_1.returnBadReq)(res, err);
            });
        }
        catch (e) {
            (0, returnmodels_1.returnServerError)(res, e);
        }
    });
}
exports.getConfigMatch = getConfigMatch;
function verifyAnimalExist(aid, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const animalDoc = DatabaseRoutes_1.fsAnimalCollection.doc(aid);
        if (!(yield animalDoc.get()).exists) {
            (0, returnmodels_1.returnNotFound)(res, { message: "Profile not found" });
            return false;
        }
        return true;
    });
}
exports.verifyAnimalExist = verifyAnimalExist;
function getAnimalFollowingDocument(aid) {
    return DatabaseRoutes_1.fsAnimalCollection.doc(aid).collection("followList").doc("following");
}
exports.getAnimalFollowingDocument = getAnimalFollowingDocument;
function getAnimalFollowersDocument(aid) {
    return DatabaseRoutes_1.fsAnimalCollection.doc(aid).collection("followList").doc("followers");
}
exports.getAnimalFollowersDocument = getAnimalFollowersDocument;
//# sourceMappingURL=animals.controllers.js.map