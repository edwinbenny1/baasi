import express from "express";
import cors from "cors";
import requestRoutes from "./routes/requestRoutes.js";
import { env } from "./config/env.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Correct API base route
app.use("/api/requests", requestRoutes);

app.listen(env.PORT, () => {
  console.log(`✅ Server running on port ${env.PORT}`);
});
