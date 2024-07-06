import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        errorMessage: "Email is reqired!",
        notEmpty: true,
        trim: true,
    },
});
