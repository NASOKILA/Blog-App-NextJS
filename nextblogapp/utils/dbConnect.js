import mongoose from "mongoose";

const dbConnect = async () => {
    //Check if connection has been established.
    if(mongoose.connection.readyState >= 1) return;
    
    //If not, connect to mongo db database useing the ENV variable.
    mongoose.connect(process.env.DB_URI);
}

//export the function so it can be used.
export default dbConnect;