import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import { RegisterUserRequest } from "../types";
import { UserService } from "./../services/UserService";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}
    // create new user using register
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password } = req.body;

        this.logger.debug("New request to register a user", {
            firstName,
            lastName,
            email,
            password: "******",
        });

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });
            this.logger.info("User has benn Register", { id: user.id });

            // const accessToken = generateAccessToken(user);
            // const refreshToken = generateRefreshToken(user);
            const accessToken = "generateAccessToken(user)";
            const refreshToken = "generateRefreshToken(user)";

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
            });
            res.status(201).json({ id: user });
        } catch (err) {
            next(err);
            return;
        }
    }
}
