import { User } from '../models/User.js'
import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../utils/errorHandler.js'
import { sendToken } from '../utils/sendToken.js'
import { Assignment } from '../models/Assignment.js'
import client from '../utils/cache.js'

// user register
export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) return next(new ErrorHandler('Enter all fields', 400))
    let user = await User.findOne({ email })
    if (user) return next(new ErrorHandler('User already exist'), 409)
    user = await User.create({
        name, email, password,
    })
    sendToken(res, user, "Registered Successfully", 201);
})

// user login
export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) return next(new ErrorHandler('Enter all fields', 400))
    const user = await User.findOne({ email }).select("+password")
    if (!user) return next(new ErrorHandler('Incorrect', 401))
    const isMatch = await user.comparePassword(password)
    if (!isMatch) return next(new ErrorHandler('Incorrect', 401))
    sendToken(res, user, "Logged in Successfully", 200);
})


export const uploadAssignment = catchAsyncError(async (req, res, next) => {
    const { userId, task, admin } = req.body;
    if (!userId || !task || !admin) {
        return next(new ErrorHandler('Enter all fields', 400));
    }
    const user = await User.findOne({ name: userId });
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    const adminUser = await User.findOne({ name: admin });
    if (!adminUser || adminUser.role !== 'admin') {
        return next(new ErrorHandler('Admin not found or not authorized', 404));
    }
    const assignment = await Assignment.create({
        userId: user._id,
        task,
        admin: adminUser._id,
        status: 'pending'
    });
    res.status(201).json({
        success: true,
        message: 'Assignment Uploaded',
        assignment
    });
});

// getting all admins
export const getAllAdmins = catchAsyncError(async (req, res, next) => {
    const cachedAdmins = await client.get('admins')
    if (cachedAdmins) {
        return res.status(200).json({
            success: true,
            admins: JSON.parse(cachedAdmins),
        });
    }
    const admins = await User.find({ role: 'admin' })
    if (!admins) return next(new ErrorHandler('Admins not found', 404))
    await client.set('admins', JSON.stringify(admins), 'EX', 3600);
    res.status(200).json({
        success: true,
        admins
    })
})