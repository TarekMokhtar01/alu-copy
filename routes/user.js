import express from "express";
import {
  createUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addToCart,
  updateCartItem,
} from "../controllers/user.js";
import {
  createUserValidator,
  updateUserValidator,
} from "../validators/user.js";

import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/cart", auth(["user"]), addToCart);
router.put("/cart/:productId", auth(["user"]), updateCartItem);

router.post("/signup", createUserValidator, createUser);
router.post("/login", loginUser);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUserValidator, updateUser);
router.delete("/:id", deleteUser);

export default router;
