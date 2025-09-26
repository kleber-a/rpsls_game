import mongoose, {mongo} from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); 

async function connectionDataBase() {
    mongoose.connect(process.env.MONGO_URI)
    return mongoose.connection;
} 

export default connectionDataBase;