import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // We need to know the user ID to get all the Blogs he liked.
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";

export async function GET(req) {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_URL });
    console.log("Token: ", token);
    try {
        //Get the blog based on the likes with Id matching the userID
        const blogs = await Blog.find({ likes: token.user._id });
        return NextResponse.json(
            {blogs},
            {status: 200},
        );
    }
    catch (error) {
        return NextResponse.json(
            {err: "Internal Server Error"},
            {status: 500},
        );
    }
}