import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";

export async function PUT(req){
    await dbConnect();
    const _req = await req.json();
    const { blogId } = _req;
    const token = await getToken({req, secret: process.env.JWT_SECRET});

    try {
        //Update the blog by adding the like
        const updated = await Blog.findByIdAndUpdate(blogId, { 
            $addToSet: { likes: token.user._id }
        }, { new : true });

        return NextResponse.json(updated, {status: 200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({err: err.message}, {status: 500});
    }
}