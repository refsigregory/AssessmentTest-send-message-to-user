import express from "express";
import { createUser, deleteUser, findAll, updateUser } from "./controllers/user";

const router = express.Router();

router.route("/")
  .get(findAll)
  .put(createUser);

router.route("/:UserId").post(updateUser);
router.route("/:UserId").delete(deleteUser);

export default router;
