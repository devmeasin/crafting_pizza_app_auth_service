import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Email is required!",
        },
        trim: true,
        isEmail: {
            errorMessage: "Email is not valid",
        },
    },
    firstName: {
        in: ["body"],
        isString: {
            errorMessage: "First name cannot be empty",
        },
        notEmpty: {
            errorMessage: "First name cannot be empty",
        },
    },
    lastName: {
        in: ["body"],
        isString: {
            errorMessage: "Last name cannot be empty",
        },
        notEmpty: {
            errorMessage: "Last name cannot be empty",
        },
    },
    password: {
        isLength: {
            options: { min: 8 },
            errorMessage: "password should be at least 8 chars",
        },
    },
});
