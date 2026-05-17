import mongoose from "mongoose";

export const connectDB = async () => {

    try {

        const uri = process.env.MONGO_URI;
        if(!uri) {
            throw new Error("Mongo URI not found!")
        }
        const conn = await mongoose.connect(uri);
        console.log(`mongodb database connected : ${conn.connection.host}`);
        
    } catch (err) {
        console.error("MongoDB error : ", err);
        process.exit(1);
    }
}