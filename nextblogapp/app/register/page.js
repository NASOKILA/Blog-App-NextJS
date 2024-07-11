'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`${process.env.API}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
            
            
            if (!response.ok) {
                const data = await response.json();
                console.log(data.err)
                setLoading(false);
                return;
            }
            
            const data = await response.json();
            console.log("Registered successfully");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            router.push("/login");
        }
        catch (error) {
            console.log(error.message);
            setLoading(false);
            console.log("Something went wrong");
        }
    }

    return (
        <div className="container">
            <div className="d-flex row justify-content-center align-items-center vh-100">
                <div className="col-lg-5 bg-light p-5 shadow">
                    <h1 className="lead">Register</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Loading..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
