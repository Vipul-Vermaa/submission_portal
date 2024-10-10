import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../utils/errorHandler.js'
import { Assignment } from '../models/Assignment.js'
import { User } from '../models/User.js'
import { sendToken } from '../utils/sendToken.js'


// admin register
export const adminRegister = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) return next(new ErrorHandler('Enter all fields', 400))
    let user = await User.findOne({ email })
    if (user) return next(new ErrorHandler('User already exist'), 409)
    user = await User.create({
        name, email, password, role: 'admin',
    })
    sendToken(res, user, "Registered Successfully", 201);
})


// admin login
export const adminLogin = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) return next(new ErrorHandler('Enter all fields', 400))
    const user = await User.findOne({ email }).select("+password")
    if (!user) return next(new ErrorHandler('Incorrect 1', 401))
    const isMatch = await user.comparePassword(password)
    if (!isMatch) return next(new ErrorHandler('Incorrect 2', 401))
    sendToken(res, user, "Logged in Successfully", 201);
})


// assignments tagged to the admin
export const getAssignments = catchAsyncError(async (req, res, next) => {
    const assignments = await Assignment.find({ admin: req.user._id })
    if (!assignments || assignments.length === 0) return next(new ErrorHandler('No assignment found', 404))
    res.status(200).json({
        success: true,
        assignments
    })
})

// accepting an assignment
export const acceptAssignment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const assignment = await Assignment.findById(id)
    if (!assignment) return next(new ErrorHandler('Not found', 404))
    if (assignment.admin.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler('Access Denied', 403))
    }
    assignment.status = 'accepted';
    await assignment.save()
    res.status(200).json({
        success: true,
        message: 'Assignment accepted',
        assignment
    })
})

// rejecting an assignment
export const rejectAssignment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const assignment = await Assignment.findById(id)
    if (!assignment) return next(new ErrorHandler('Not found', 404))
    if (assignment.admin.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler('You are not authorized to reject this assignment', 403));
    }
    assignment.status = 'rejected'
    await assignment.save()
    res.status(200).json({
        success: true,
        message: 'Assignment rejected',
        assignment
    })
})