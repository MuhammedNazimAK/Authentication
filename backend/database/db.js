import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "Core"
        });
        console.log("Database connected");
    } catch (error) {
        console.log("database error", error);
    }
}
