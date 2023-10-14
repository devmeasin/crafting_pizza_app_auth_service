import { Request, Response } from "express";
export class AuthController {
    // create new user using register method
    register(req: Request, res: Response) {
        res.status(201).json("<h1>Hello Coder's🎉</h1>");
    }
}
