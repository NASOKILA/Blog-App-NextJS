import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";
import { getToken } from "next-auth/jwt";

export async function PUT(req){
    await dbConnect();
    const _req = await req.json();
    const { blogId } = _req;
    const token = await getToken({req, secret: process.env.JWT_SECRET});

    try {
        //Update the blog by removing the like 
        const updated = await Blog.findByIdAndUpdate(blogId, { 
            $pull: { likes: token.user._id }
        }, { new : true });

        return NextResponse.json(updated, {status: 200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({err: err.message}, {status: 500});
    }
}