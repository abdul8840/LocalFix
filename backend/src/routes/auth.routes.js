import express from "express";
import {
  registerCustomer,
  registerWorker,
  login,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  registerCustomerSchema,
  registerWorkerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register/customer", validate(registerCustomerSchema), registerCustomer);
router.post("/register/worker",   validate(registerWorkerSchema),   registerWorker);
router.post("/login",             validate(loginSchema),            login);
router.get("/me",                 protect,                          getMe);
router.post("/logout",            protect,                          logout);

export default router;