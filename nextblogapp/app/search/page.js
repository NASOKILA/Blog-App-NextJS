'use client'
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/context/search";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import BlogLike from "@/components/BlogLike";
import Link from "next/link";

dayjs.extend(relativeTime);

export default function Search() {
    const { setSearchQuery, searchResults, setSearchResults } = useSearch();

    const searchParams = useSearchParams();
    const query = searchParams.get("searchQuery");

    useEffect(() => {
        fetchResultsOnLoad();
        setSearchQuery(query);
    }, [query]);

    const fetchResultsOnLoad = async () => {
        try {
            const response = await fetch(`${process.env.API}/search?searchQuery=${query}`);
            if (!response.ok) {
                throw new Error("An error occured, try again.")   
            }

            const data = await response.json();
            setSearchResults(data);
        }
        catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <p className="lead">Search result {searchResults.lenght}</p>
                    <div className="container mb-5">
                        <div className="row">
                        {searchResults && searchResults?.map(blog => (
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
