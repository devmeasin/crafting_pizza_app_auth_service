import request from "supertest";
import app from "../../src/app";

describe("POST  /auth/register", () => {
    describe("Given all fields", () => {
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
