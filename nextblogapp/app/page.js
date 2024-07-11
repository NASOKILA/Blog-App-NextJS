import styles from './page.module.css'
import queryString from 'query-string'
import Link from 'next/link'
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import BlogLike from '@/components/BlogLike';

dayjs.extend(relativeTime);

async function GetBlogs(searchParams) {
  const urlParams = { page: searchParams.page || "1" };
  const searchQuery = new URLSearchParams(urlParams).toString();
  const res = await fetch(`${process.env.API}/blog?${searchQuery}`, { 
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 1 } // This will keep the list of blogs updated every 1 second.

   });
   if(!res.ok){
    console.log("Failed to fetch blogs => ", res.statusText);
    throw new Error("Failed to fetch blogs");
   }

   const data = await res.json();
   return data;
  }
  
  export default async function Home({searchParams = {page: "1"}}) {
    const data = await GetBlogs(searchParams); 
    const { blogs, currentPage, totalPages } = data;
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    return (
      <div className='container'>
        <p className='lead text-primary text-center'>Latest Blogs</p>
        <div className="container mb-5">
            <div className="row">
              {blogs?.map(blog => (
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
                        {/*<small className='text-muted'>❤️ {blog?.likes?.length} likes</small>*/}
                        <small className='text-muted'>Posted {dayjs(blog.createdAt).fromNow()}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
        <div className='d-flex justify-content-center'>
          <nav aria-label='Page navigation'>
            <ul className='pagination'>

              {hasPreviousPage && (
                <li className='page-item'>
                  <Link className='page-link' href={`/?page=${currentPage - 1}`}>
                    Previous
                  </Link>
                </li>
              )}

              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                return (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <Link className='page-link' href={`/?page=${page}`}>
                      {page}
                    </Link>
                  </li>
                );
              })}

              {hasNextPage && (
                <li className='page-item'>
                  <Link className='page-link' href={`/?page=${currentPage + 1}`}>
                    Next
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    )
}
