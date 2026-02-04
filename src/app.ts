import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import router from "./routes";

const app: Application = express();

app.use(express.json());

app.use("/api/v1", router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
