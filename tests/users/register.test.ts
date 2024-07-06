import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";

describe("POST  /auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Database truncate
        // await truncateTables(connection);
        await connection.dropDatabase();
        await connection.synchronize();
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
                password: "password",
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
                password: "password",
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
                password: "password",
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

        test("should assign a customer role", async () => {
            // AAA
            // Arrange
            const userData = {
                firstName: "Mohammad",
                lastName: "Easin",
                email: "codereasin@gmail.com",
                password: "password",
            };
            // Act
            await request(app).post("/auth/register").send(userData);

            // Assart
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });

        test("should password not.toBe equal password in db", async () => {
            // AAA
            // Arrange
            const userData = {
                firstName: "Mohammad",
                lastName: "Easin",
                email: "codereasin@gmail.com",
                password: "password",
            };
            // Act
            await request(app).post("/auth/register").send(userData);

            // Assart
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it("should be return 404 status code if email in db already existis", async () => {
            // AAA
            // Arrange
            const userData = {
                firstName: "Mohammad",
                lastName: "Easin",
                email: "codereasin@gmail.com",
                password: "password",
            };

            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            const users = await userRepository.find();

            // Assart
            expect(response.statusCode).toBe(404);
            expect(users).toHaveLength(1);
        });
    });

    describe("fields are missing", () => {
        test("should be return 400 status code is enail field is missing", async () => {
            // AAA
            // Arrange
            const userData = {
                firstName: "Mohammad",
                lastName: "Easin",
                email: "",
                password: "password",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assart
            expect(response.statusCode).toBe(400);
            const users = await connection.getRepository(User).find();
            expect(users).toHaveLength(0);
        });
    });

    describe("fields are not proper format", () => {
        test("should be return trim value email field", async () => {
            // AAA
            // Arrange
            const userData = {
                firstName: "Mohammad",
                lastName: "Easin",
                email: "  codereasin@gmail.com  ",
                password: "password",
            };
            // Act
            await request(app).post("/auth/register").send(userData);
            // Assart
            const users = await connection.getRepository(User).find();
            expect(users[0].email).toBe("codereasin@gmail.com");
        });
    });
});
