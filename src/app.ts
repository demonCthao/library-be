import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import router from "./routes";
import { errorMiddleware } from "./middlleware/error.middleware";

const app: Application = express();

app.use(express.json());
app.use("/api/v1", router);
app.use(errorMiddleware)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
