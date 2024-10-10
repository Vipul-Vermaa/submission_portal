import mongoose from "mongoose";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

export const signUpSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .trim()
        .min(3, { message: 'atleast 3' }),

    email: z
        .string({ message: 'Enter Your Email' })
        .email({ message: 'Invalid email format' }),

    password: z
        .string()
        .min(6, { message: 'must be six letter or more' }),

    role: z
        .enum(['admin', 'user'])
        .default('user'),
});

export const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body)
        req.body = parseBody
        next()
    } catch (error) {
        const message = error.errors[0].message;
        res.status(400).json({ msg: message })
    }
}

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter Your Name'],
    },
    email: {
        type: String,
        required: [true, 'Enter Your Email'],
        unique: true,
        validate: [validator.isEmail, 'Invalid email format'],
    },
    password: {
        type: String,
        required: [true, 'Enter Your Password'],
        minLength: [6, 'must be six letter or more'],
        select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true,
        default: 'user',
    },
}, { timestamps: true })

schema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


schema.methods.getJWTToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: "15d" }
    );
}
schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


export const User = mongoose.model('User', schema)