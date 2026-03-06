import { listMenuItems } from "../services/menuService.js";

export const getMenu = async (_req, res, next) => {
  try {
    const menu = await listMenuItems();
    res.json(menu);
  } catch (error) {
    next(error);
  }
};
