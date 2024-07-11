'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import "react-quill/dist/quill.snow.css"

export default function UpdateBlog({params}) {
    // state
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        getBlog();
    }, [params]);

    async function getBlog(){
        try {
            const response = await fetch(`${process.env.API}/blog/${params.slug}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log("BLOG DATA => ", data);
                setId(data._id);
                setTitle(data.title);
                setContent(data.content);
                setCategory(data.category);
                setImageUrl(data.image);
            } else {
                console.log("An error occured, try again.")
            }
        } 
        catch (error) {
            console.log(error);
            console.log("An error occured, try again.")
        }
    }

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);
    
            try {
                const response = await fetch(process.env.CLOUDINARY_URL, {
                    method: 'POST',
                    body: formData,
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setImageUrl(data.secure_url);
                } else {
                    // Error handling for non-200 responses
                    console.error('Upload failed:', await response.text());
                }
            } catch (error) {
                // Network or other errors
                console.error('Error:', error.message);
            }
            setLoading(false);
        }
    };
    
    const handleUpdate = async(e) => {
        try {
            const response = await fetch(`${process.env.API}/admin/blog/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    content,
                    category,
                    image: imageUrl
                })
            });

            if (response.ok) {
                window.location.href = "/dashboard/admin/blog/list";
                console.log("Blog UPDATED successfully");
            }
            else {
                const data = await response.json();
                console.log(data);
            }

        } 
        catch (error) {
            console.log(error)
            console.log("An Error occured, try again.")
        }   
    }

    const handleDelete = async(e) => {
        try {
            const response = await fetch(`${process.env.API}/admin/blog/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    content,
                    category,
                    image: imageUrl
                })
            });

            if (response.ok) {
                window.location.href = "/dashboard/admin/blog/list";
                console.log("Blog DELETED successfully");
            }
            else {
                const data = await response.json();
                console.log(data);
            }

        } 
        catch (error) {
            console.log(error)
            console.log("An Error occured, try again.")
        }   
    }

    return (
        <div className="container">
            <div className='row'>
                <div className='col'>
                    <p className='lean'>Update Blog</p>
                    <label className='text-secondary'>Title</label>
                    <input type='text' className='form-control p-2 my-2' value={title} onChange={(e) => setTitle(e.target.value)} />

                    <label className='text-secondary'>Blog content</label>
                    <ReactQuill className='border rounded my-2' value={content} onChange={setContent} />

                    <label className='text-secondary'>Blob category</label>
                    <input type='text' className='form-control p-2 my-2' value={category} onChange={(e) => setCategory(e.target.value)} />
                    
                    {imageUrl && (
                        <img src={imageUrl} alt="image" style={{width: "100px"}} />
                    )}
                    
                    <div className='d-flex justify-content-between mt-3'>
                        <button className='btn btn-outline-secondary'>
                            <label htmlFor='upload-button' className='mt-2 pointer' >{loading ? "Uploading..." : "Upload image"}</label>
                            <input id="upload-button" type="file" accept="image/*" onChange={uploadImage} hidden />
                        </button>

                        <div>
                            <button className='btn bg-primary text-light' disabled={loading} onClick={handleUpdate}>Update</button> <span> | </span>
                            <button className='btn bg-danger text-light' disabled={loading} onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}