import express from 'express'
import { adminLogin, acceptAssignment, getAssignments, rejectAssignment, adminRegister } from '../controllers/adminController.js'
import { validate } from "../models/User.js";
import { signUpSchema } from '../models/User.js'
import { isAdmin, isAuthenticated } from '../middlewares/auth.js'


const router = express.Router()

// admin register
router.route('/admin/register').post(validate(signUpSchema), adminRegister)

// admin login
router.route('/admin/login').post(adminLogin)

// getting all assignments
router.route('/assignments').get(isAuthenticated, isAdmin, getAssignments)

// accepting assignment
router.route('/assignments/:id/accept').post(isAuthenticated, isAdmin, acceptAssignment)

// rejecting assignment
router.route('/assignments/:id/reject').post(isAuthenticated, isAdmin, rejectAssignment)

export default router