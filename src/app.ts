import express, { Application } from "express";
import { setupSwagger } from "./swagger";

const app: Application = express();

app.use(express.json());
setupSwagger(app);

export default app;
