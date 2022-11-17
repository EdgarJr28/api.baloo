import express, { application } from 'express'
import cors from "cors";
import fileUpload from 'express';
import path from 'path'
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import { createFolders } from './libs/createFolders';
import dbON from './config/config.database';

// routes 
import indexRout from './routes/index.routes'
import configRout from './routes/config.routes'
import animalsRout from './routes/animals.routes'
import userRout from './routes/user.routes'
import servicesRout from './routes/services.routes'
import medicalRout from './routes/medicalRecord.routes'
import storysRout from './routes/storys.routes'
import postsRout from './routes/posts.routes'
import matchRoutes from './routes/matchs.routes'
import chatRoutes from './routes/chat.routes'
import follow from "./routes/follow.route"
import adminpanel from './routes/adminPanel.routes'
import appleconfig from "./routes/applesigin.routes";
import { perareConfig } from './libs/configModule';
import pubRoutes from './routes/publicity.routes';
import Server from './socket/config/serverSockets';
import { APP, SERVER_PORT } from './socket/config/server';

// config firebase 
dbON();

// Api config
dotenv.config({ path: path.resolve("./.env") });

// sockets
const server = Server.instance;

perareConfig();

APP.use(express.json());
APP.use(express.urlencoded({ extended: false }));
APP.use(cors());
APP.use(fileUpload());

APP.use(morgan('dev'));
APP.use('/uploads', express.static(path.resolve()));

// Routes
APP.use(indexRout);
APP.use(configRout);
APP.use(animalsRout);
APP.use(userRout);
APP.use(servicesRout);

APP.use(medicalRout);
APP.use(storysRout);
APP.use(postsRout);
APP.use(matchRoutes);
APP.use(follow);
APP.use(adminpanel);
APP.use(appleconfig);
APP.use(pubRoutes);

APP.use(chatRoutes);


var a = process.env;

server.start(() => {
    console.log("|------- ", Date(), " -------|");
    console.log("Server Listening on port: ", SERVER_PORT);
});
