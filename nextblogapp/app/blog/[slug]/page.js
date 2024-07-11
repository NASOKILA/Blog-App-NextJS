import BlogLike from '@/components/BlogLike';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { get } from 'mongoose';
import Link from 'next/link';

dayjs.extend(relativeTime);

async function getBlog(slug){
    const response = await fetch(`${process.env.API}/blog/${slug}`, {
        method: "GET",
        next: { revalidate: 1 }
    });

    if(!response.ok){
        throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
}

export default async function BlogViewPage({params}){
    console.log("params => ", params);
    const blog = await getBlog(params.slug);

    return (
        <main>
            <div className='container bg-5'>
                <div className='card'>
                    <div style={{height: "300px", overflow: "hidden"}}>
                        <img 
                        src={blog?.image || "/images/default-blog.jpg"} 
                        className="card-img-top" 
                        style={{objectFit: "cover", height: "100%", width: "100%"}} 
                        alt={blog.title} />
                    </div>
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
        </main>
    )
}