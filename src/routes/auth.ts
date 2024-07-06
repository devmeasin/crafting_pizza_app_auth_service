import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { User } from "../entity/User";
import resgisterValidator from "../validator/register-validator";
import { AuthController } from "./../controllers/AuthController";
import { UserService } from "./../services/UserService";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, logger);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/register",resgisterValidator, (req : Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next)
);

export default router;
