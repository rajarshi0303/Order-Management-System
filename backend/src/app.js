import express from "express";
import cors from "cors";
import menuRouter from "./routes/menuRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/menu", menuRouter);
app.use("/api/orders", orderRouter);

app.use(errorHandler);

export default app;
