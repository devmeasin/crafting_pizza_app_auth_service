import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { truncateTables } from "../utils";
import { User } from "../../src/entity/User";

describe("POST  /auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Database truncate
        await truncateTables(connection);
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        // return statusCode 201 using api call post methoad
        test("should be return statusCode 201", async () => {
            // AAA
            // Arrange
            const userData = {
                firstName: "Mohammad",
                lastName: "Easin",
                email: "codereasin@gmail.com",
                password: "pass",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assart
            expect(response.statusCode).toBe(201);
        });

        // return json data using api call post methoad
        test("should be return json data", async () => {
            // AAA
            // Arrange
            const userData = {
                firstName: "Mohammad",
                lastName: "Easin",
                email: "codereasin@gmail.com",
                password: "pass",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assart
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });

        // persist user data in database
        test("should be persist user data in database", async () => {
            // AAA
            // Arrange
            const userData = {
                firstName: "Mohammad",
                lastName: "Easin",
                email: "codereasin@gmail.com",
                password: "pass",
            };
            // Act
            await request(app).post("/auth/register").send(userData);

            // Assart
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });
    });

    describe("fields are missing", () => {
        test("should ", async () => {
            // AAA
            // Arrange
            // Act
            // Assart
        });
    });
});
