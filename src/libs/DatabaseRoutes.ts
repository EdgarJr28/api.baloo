import { fsRoot } from "../config/config.database";


export const fsUserCollection = fsRoot.collection("users");
export const fsAnimalCollection = fsRoot.collection("animalProfiles");
export const fsAnimalsTypeDB = fsRoot.collection("animaltypes");
export const fsServicesCollection = fsRoot.collection("servicesProfiles");
export const fsPostCollection = fsRoot.collection("Posts");
export const fsStoryCollection = fsRoot.collection("Storys");
export const fsAdminPanelUsers = fsRoot.collection("AdminUsers");
export const fsPublicityCollection = fsRoot.collection("Publicity");
export const fsConfigCollection = fsRoot.collection("config");