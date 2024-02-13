import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('MongoDB is already to connect!')
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "DChatApp",
        })

        isConnected = true
        console.log('Connect MongoDB Successfully!')
    } catch (e) {
        console.log(e)
    }
}