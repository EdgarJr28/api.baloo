"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsConfigCollection = exports.fsPublicityCollection = exports.fsAdminPanelUsers = exports.fsStoryCollection = exports.fsPostCollection = exports.fsServicesCollection = exports.fsAnimalsTypeDB = exports.fsAnimalCollection = exports.fsUserCollection = void 0;
const config_database_1 = require("../config/config.database");
exports.fsUserCollection = config_database_1.fsRoot.collection("users");
exports.fsAnimalCollection = config_database_1.fsRoot.collection("animalProfiles");
exports.fsAnimalsTypeDB = config_database_1.fsRoot.collection("animaltypes");
exports.fsServicesCollection = config_database_1.fsRoot.collection("servicesProfiles");
exports.fsPostCollection = config_database_1.fsRoot.collection("Posts");
exports.fsStoryCollection = config_database_1.fsRoot.collection("Storys");
exports.fsAdminPanelUsers = config_database_1.fsRoot.collection("AdminUsers");
exports.fsPublicityCollection = config_database_1.fsRoot.collection("Publicity");
exports.fsConfigCollection = config_database_1.fsRoot.collection("config");
//# sourceMappingURL=DatabaseRoutes.js.map