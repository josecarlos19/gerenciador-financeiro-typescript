import "reflect-metadata";
import express from "express";
import "./database";
import { routes } from "./routes";
import dotenv from "dotenv";

dotenv.config({
	path: process.env.NODE_ENV == "test" ? ".env.test" : ".env"
});

const app = express();

app.use(express.json());

app.use(routes);

export {app};
