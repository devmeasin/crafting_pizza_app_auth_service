import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { JwtPayload } from "jsonwebtoken";
import { Logger } from "winston";
import { CredentialService } from "../services/CredentialService";
import { TokenService } from "../services/TokenService";
import { AuthRequest, RegisterUserRequest, UserData } from "../types";
import { UserService } from "./../services/UserService";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
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

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            // presist refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                id: String(newRefreshToken.id),
                ...payload,
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1h
                httpOnly: true,
                // secure: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
                httpOnly: true,
            });
            res.status(201).json({ id: user.id, role: user.role });
        } catch (err) {
            return next(err);
        }
    }

    // user login func
    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        //check the user exist or not
        const { email, password } = req.body;

        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                const err = createHttpError(
                    400,
                    "Email or password was worong!",
                );
                return next(err);
            }

            // check password
            const isMatchPassword =
                await this.credentialService.comparePassword(
                    password,
                    user.password,
                );
            if (!isMatchPassword) {
                const err = createHttpError(
                    400,
                    "Email or password was worong!",
                );
                return next(err);
            }

            this.logger.info("User has benn Login", { id: user.id });

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            // presist refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                id: String(newRefreshToken.id),
                ...payload,
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1h
                httpOnly: true,
                // secure: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
                httpOnly: true,
            });
            res.json({ id: user.id, role: user.role });
        } catch (err) {
            return next(err);
        }
    }

    async self(req: AuthRequest, res: Response) {
        const userData = await this.userService.findById(req.auth.sub);
    
        const userWithoutPassword = (userData: UserData) => {

            interface UserDataX {
                firstName: string;
                lastName: string;
                email: string;
                password?: string;
            }

          const userCopy:UserDataX = { ...userData }; // CREATE A COPY OF THE OBJECT
          if (userCopy.password) {
            delete userCopy.password; // DELETE THE PASSWORD PROPERTY
          }
          return userCopy; // RETURN UPDATED USER
        };
        return res.json(userData && userWithoutPassword(userData));
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    
        try {

            const payload: JwtPayload = {
                sub: String(req.auth.sub),
                role: req.auth.role,
            };

            const user = await this.userService.findById(req.auth.sub);

            this.logger.info("User has ben Refresh", { id: req.auth.sub });

            if(!user) {
                const err = createHttpError(404, "User not found");
                return next(err);
            }

            const accessToken = this.tokenService.generateAccessToken(payload);

            // presist refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

             // delete old refresh token    
             await this.tokenService.deleteRefreshToken(Number(req.auth.id));

            const refreshToken = this.tokenService.generateRefreshToken({
                id: String(newRefreshToken.id),
                ...payload,
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1h
                httpOnly: true,
                // secure: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
                httpOnly: true,
            });
            res.json({ id: user.id});

        } catch(err) { 
            return next(err);
        }
    }
}
