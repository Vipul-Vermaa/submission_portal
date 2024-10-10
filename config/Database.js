import mongoose from "mongoose";

export const connectDB = async () => {
    const { connection } = await mongoose.connect(process.env.MONGO_URI)  //connecting with Database
    console.log(`Connected to ${connection.host}`)
}