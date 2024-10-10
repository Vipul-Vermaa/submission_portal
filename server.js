import app from "./app.js";
import { connectDB } from "./config/Database.js";

connectDB()

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server is runnnig on port ${PORT}`)
})