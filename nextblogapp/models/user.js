import mongoose from "mongoose";

//We create the schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        role: {
            type: String,
            default: "user"
        },
        image: {
            type: String
        }
    },
    role: {
        type: String,
        default: "user"
    },
}, {timestamps: true});

//We export the schema model so we can use it in our controllers
export default mongoose.models.User || mongoose.model("User", userSchema);