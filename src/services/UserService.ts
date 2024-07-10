import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { Roles } from "../constants";
import { User } from "../entity/User";
import { UserData } from "../types";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        // check in user db
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            const err = createHttpError(400, "Email already exists in DB!");
            throw err;
        }
        // passWord Has saltRound
        const saltRounds = 10;
        // password hash func here
        const hasPassword = await bcrypt.hash(password, saltRounds);

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hasPassword,
                role: Roles.CUSTOMER,
            });
        } catch (err) {
            const error = createHttpError(
                500,
                "faild to store the data in the db",
            );
            throw error;
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }
    async findById(id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }
}
