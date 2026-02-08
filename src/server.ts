import "dotenv/config";
import app from "./app";

const HOST = "127.0.0.1"
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, HOST, () => {
  console.log(`🚀 Express chạy tại http://${HOST}:${PORT}/api-docs/`);
});
