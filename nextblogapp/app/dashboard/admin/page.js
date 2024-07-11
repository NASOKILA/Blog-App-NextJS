"use client"
import BlogLike from "@/components/BlogLike";
import Link from "next/link";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);


export default function AdminDashboard(){
    const [likedBlogs, setLikedBlogs] = useState([])

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await fetch("/api/user/blog/liked-blogs");
            if(!response.ok) {
                throw new Error("Something went wrong");
            }
            else {
                const data = await response.json();
                setLikedBlogs(data.blogs);
            }

        }
        catch(err){
            console.error(err);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <p className="lead">Admin Liked Blogs</p>
                    <div className="container mb-5">
                        <div className="row">
                        {likedBlogs?.map(blog => (
                            <div className="col-lg-4" key={blog._id}>
                            <div className="card mb-4">
                                <div style={{ height: "200px", overflow: "hidden" }}>
                                <img src={blog.image || "/images/preview-not-available.png"} style={{ objectFit: 'cover', height: '100%', width: '100%' }} className="card-img-top" alt={blog.title} />
                                </div>
                                <div className="card-body">
                                <h5>
                                    <Link href={`/blog/${blog.slug}`}>
                                        {blog.title}
                                    </Link>
                                </h5>
                                <div className='card-text'>
                                    <div dangerouslySetInnerHTML={{
                                        __html: blog.content.lenght > 160 
                                        ? `${blog.content.substring(0, 160)}...`
                                        : blog.content
                                    }}>
                                    </div>
                                </div>
                                <div className='card-footer d-flex justify-content-between'>
                                    <small className='text-muted'>Category: {blog?.category}</small>
                                    <small className='text-muted'>Author: {blog?.postedBy?.name || "Admin"}</small>
                                </div>
                                <div className='card-footer d-flex justify-content-between'>
                                    <BlogLike blog={blog} />
                                    <small className='text-muted'>Posted {dayjs(blog.createdAt).fromNow()}</small>
                                </div>
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}