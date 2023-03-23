import { Router } from "express";

import checkAuth from "../middleware/check-auth";

import {
  Categories_get_all,
  Categories_create_category,
  Categories_get_category,
  Categories_change_category,
  Categories_delete_category,
} from "../controllers/categories";

const router = Router();

//Making get request to /categories
router.get("/", Categories_get_all);

//Making post request to /categories
router.post("/", checkAuth, Categories_create_category);

//Making get request to /categories/(id that user provided) and Searching by ID
router.get("/:categoriesId", Categories_get_category);

//Making patch request to /categories/(id that user provided)
router.patch("/:categoriesId", checkAuth, Categories_change_category);

//Making delete request to /categories/(id that user provided)
router.delete("/:categoriesId", checkAuth, Categories_delete_category);

export default router;
