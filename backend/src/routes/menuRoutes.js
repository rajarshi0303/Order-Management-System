import { Router } from "express";
import { getMenu } from "../controllers/menuController.js";

const menuRouter = Router();

menuRouter.get("/", getMenu);

export default menuRouter;
