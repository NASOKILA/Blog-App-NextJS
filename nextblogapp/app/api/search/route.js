import { NextResponse } from 'next/server'
import Blog from '@/models/blog'
import dbConnect from '@/utils/dbConnect'
import queryString from 'query-string'

export async function GET(req) { 
    await dbConnect();
    
    const { searchQuery } = queryString.parseUrl(req.url).query;

    try {
        // We search for the blog title, content, and category
        const blogs = await Blog.find({ 
            $or: [
                { title: { $regex: searchQuery, $options: 'i'} },
                { content: { $regex: searchQuery, $options: 'i'} },
                { category: { $regex: searchQuery, $options: 'i'} }
            ] 
        }).sort({ createdAt: -1});
        
        return NextResponse.json(blogs, { status: 200 });
    }
    catch (err) {

        return NextResponse.json({
            err,
            status: 500,
        });
    }
}