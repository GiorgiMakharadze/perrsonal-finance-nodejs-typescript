import { Router } from "express";

import { Defaults_get_all, Defaults_get_default } from "../controllers/default";

const router = Router();

router.get("/", Defaults_get_all);

router.get("/:defaultsId", Defaults_get_default);

export default router;
