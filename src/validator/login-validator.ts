import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Email cannot be empty",
        },
        trim: true,
    },

    // password
    password: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Password field value is missing!",
        },
    },
});
