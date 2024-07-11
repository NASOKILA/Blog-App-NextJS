import styles from '../../../../page.module.css'
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
  
  export default async function AdminBlogslist({searchParams = {page: "1"}}) {
    const data = await GetBlogs(searchParams);
    const { blogs, currentPage, totalPages } = data;
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    return (
      <div className='container'>
        <p className='lead text-primary text-center'>Latest Blogs</p>
        
        {blogs?.map(blog => (
            <div key={blog._id} className='d-flex justify-content-between'>
                <p>{blog.title}</p>
                <Link className='text-danger' href={`/dashboard/admin/blog/update/${blog.slug}`}>Update or Delete</Link>
            </div>
        ))}
        <div className='d-flex justify-content-center'>
          <nav aria-label='Page navigation'>
            <ul className='pagination'>

              {hasPreviousPage && (
                <li className='page-item'>
                  <Link className='page-link' href={`/dashboard/admin/blog/list/?page=${currentPage - 1}`}>
                    Previous
                  </Link>
                </li>
              )}

              {hasNextPage && (
                <li className='page-item'>
                  <Link className='page-link' href={`/dashboard/admin/blog/list/?page=${currentPage + 1}`}>
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
