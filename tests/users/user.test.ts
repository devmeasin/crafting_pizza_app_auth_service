import createJWKSMock from "mock-jwks";
import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";

describe("GET /auth/self", () => {
    // setup db conncetion
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    beforeAll(async () => {
        jwks = createJWKSMock(
            "http://localhost:5501",
        );
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Database truncate
        // await truncateTables(connection);
        await connection.dropDatabase();
        await connection.synchronize();

        jwks.start();
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        test("should be return 200 status code", async () => {
            // Arrange
            const accessToken = jwks.token({
                sub: "1",
                role: Roles.CUSTOMER,
            });

            // Act
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();
            // Assart
            expect(response.statusCode).toBe(200);
        });

        test("should be return user data", async () => {
            // Arrange
            const userData = {
                firstName: "Mohammad",
                lastName: "Easin",
                email: "codereasin@gmail.com",
                password: "password",
            };
            const userRepository = connection.getRepository(User);
            const user = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            // Act
            const accessToken = jwks.token({
                sub: String(user.id),
                role: user.role,
            });
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();

            // Assart
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(user.id);
        });
    });
});
