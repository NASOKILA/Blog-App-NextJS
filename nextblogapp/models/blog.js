import mongoose from "mongoose";

//We create the schema for the Blogs
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: { // When we click on a blog, the name of the blog goes in the URL separated with "-". That is a SLOG
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: String, // We will upload this in the cloudinary, we will receive the back URL and save it here
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // This will refer to the User Model. We will use this to populate the user who posted the blog.
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId], // Likes will be an array of user ids who liked the blog
        default:[]
    }
}, {timestamps: true});

//We export the schema model so we can use it in our controllers
export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);