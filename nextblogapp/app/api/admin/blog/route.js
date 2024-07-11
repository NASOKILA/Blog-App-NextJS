import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";
import slugify from "slugify";

export async function POST(req){

    const _req = await req.json();
    await dbConnect();

    try {
        const { title, content, category, image } = _req;
        if(!title)
            return NextResponse.json({ err: "Title is required" }, { status: 400 });
        
        if(!content)
            return NextResponse.json({ err: "Content is required" }, { status: 400 });
        
        if(!category)
            return NextResponse.json({ err: "Category is required" }, { status: 400 });

        const existingBlog = await Blog.findOne({ slug: slugify(title).toLowerCase() });
        
        if(existingBlog){
            return NextResponse.json({ err: "Blog with this title already exists" }, { status: 400 });
        }
        //Get current user Id
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        
        //Create the blog
        const blog = await Blog.create({
            title,
            slug: slugify(title).toLowerCase(),
            content,
            category,
            image: image ? image : null,
            postedBy: token.user._id
        });

        return NextResponse.json(blog, { status: 201 });
    }
    catch(err) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}