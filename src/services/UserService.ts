import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { UserData } from "../types";
import { User } from "../entity/User";
import { Roles } from "../constants";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
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
}
