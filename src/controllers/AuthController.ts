import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import fs from "fs";
import createHttpError from "http-errors";
import { sign } from "jsonwebtoken";
import path from "path";
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

            let privateKey: Buffer;
            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, "../../certs/private.pem"),
                );
            } catch (err) {
                const error = createHttpError(
                    500,
                    "Error while reading private key",
                );
                throw error;
            }

            const playload = {
                sub: user.id,
                role: user.role,
            };

            const accessToken = sign(playload, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service",
            });
            // const refreshToken = "generateRefreshToken(user)";

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1h
                httpOnly: true,
                // secure: true,
            });
            // res.cookie("refreshToken", refreshToken, {
            //     httpOnly: true,
            //     secure: true,
            // });
            res.status(201).json({ id: user });
        } catch (err) {
            next(err);
            return;
        }
    }
}
