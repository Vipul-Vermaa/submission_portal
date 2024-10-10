import express from "express";
import { isAuthenticated } from '../middlewares/auth.js'
import { validate } from "../models/User.js";
import { signUpSchema } from '../models/User.js'
import { getAllAdmins, login, register, uploadAssignment } from "../controllers/userController.js";

const router = express.Router()

// user register
router.route('/register').post(validate(signUpSchema), register)

// user login
router.route('/login').post(login)

// uploading assignment
router.route('/upload').post(isAuthenticated, uploadAssignment)

// getting all admins
router.route('/admins').get(getAllAdmins)

export default router