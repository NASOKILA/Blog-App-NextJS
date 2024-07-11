
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";

export async function GET(req, context){
    await dbConnect();

    try{
        const blog = await Blog.findOne({ slug: context.params.slug }).populate("postedBy", "name");
        return NextResponse.json(blog, {status: 200});
    }
    catch(err){
        console.log(err.message);
        return NextResponse.json({err: err.message}, {status: 500});
    }
}