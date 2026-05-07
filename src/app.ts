import express, { Application } from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import router from "./routes";
import { errorMiddleware } from "./middlleware/error.middleware";

const app: Application = express();
const allowedOrigins = [
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://localhost:5173",
];
const uploadsPath = path.join(process.cwd(), "src/uploads");

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
);
app.use(
  "/uploads",
  express.static(uploadsPath)
);
app.use("/api/v1", router);
app.use(errorMiddleware)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
