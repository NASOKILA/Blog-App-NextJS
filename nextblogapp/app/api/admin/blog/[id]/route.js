import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";


export async function PUT(req, context) {
    await dbConnect();
    console.log("context params => ", context.params);

        const _req = await req.json();
        try { 
            const updatedBLog = await Blog.findByIdAndUpdate(
                context.params.id, 
                {..._req}, 
                { new: true }
            );

            return NextResponse.json(updatedBLog, { status: 200 });
        } catch(err){
            console.log(err);
            return NextResponse.json(
                { err: "Error Occured, try again." }, 
                { status: 500 }
            );
        }



}

export async function DELETE(req, context) {
    await dbConnect();
        const _req = await req.json();
        try {
            const deletedBlog = await Blog.findByIdAndDelete(context.params.id);
            return NextResponse.json(deletedBlog, { status: 200 });
        } catch(err){
            console.log(err);
            return NextResponse.json(
                { err: "An error Occured. Try again." }, 
                { status: 500 }
            );
        }



}