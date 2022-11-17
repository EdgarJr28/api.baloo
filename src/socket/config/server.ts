import express from 'express'
import { Application } from "express";

//server config
export const APP: Application = express();
export const SERVER_PORT = Number( process.env.PORT )|| 5001;