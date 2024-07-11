'use client';
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from 'next-auth/react';

export default function BlogLike({ blog }) {
    const { data, status } = useSession();
    const [likes, setLikes] = useState(blog.likes);
    const router = useRouter();
    const pathname = usePathname();
    const isLiked = likes.includes(data?.user?._id);

    const handleLike = async () => {
        // If user has already liked, we will unklice, and viceversa.
        if(status !== 'authenticated'){ 
            console.log("Please login to like this blog...")
            router.push(`/login?callbackUrl=${pathname}`);
            return;
        }

        try {
            if(isLiked){
                const answear = window.confirm("Are you sure you want to unlike this blog?");
                if(answear){
                    // Unlike
                    handleUnlike();
                }
            }
            else {
                // Like
                const response = await fetch(`${process.env.API}/user/blog/like/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ blogId: blog?._id })
                });

                if(!response.ok){
                    console.log("Failed to like blog => ", response.statusText);
                    throw new Error("Failed to like blog");
                }
                else {
                    const data = await response.json();
                    setLikes(data.likes);                    
                }
            }
        }
        catch(err) {
            console.log("Failed to like blog => ", err.message);
        }
    }


    const handleUnlike = async () => {
        try {
            const response = await fetch(`${process.env.API}/user/blog/unlike/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ blogId: blog?._id })
            });

            if(!response.ok){
                console.log("Failed to unlike blog => ", response.statusText);
                throw new Error("Failed to unlike blog");
            }
            else {
                const data = await response.json();
                setLikes(data.likes);
            }
        }
        catch(err) {
            console.log("Failed to unlike blog => ", err.message);
        }
    }
    
    return (
        <>
            <small className='text-muted'>
                <span onClick={handleLike} style={{cursor:'pointer'}}>
                ❤️ {likes?.length} likes
                </span>
            </small>
        </>
    )
}
