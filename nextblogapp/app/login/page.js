'use client';
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const result = await signIn("credentials", { email, password, redirect: false }); 
            //We set redirect to false so we can handle the response ourselves and redirect them to wherever we want.
            
            setLoading(false);

            if (result.error) {
                console.log(result.error)
                setLoading(false);
                return;
            }
            else {
                console.log("Logged in successfully");
                setLoading(false);
                setEmail("");
                setPassword("");
                router.push(callbackUrl); // We redirect the user to the callbackUrl if it exists, otherwise we redirect them to the home page.
            }
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
                    <h1 className="lead">Login</h1>

                    <form onSubmit={handleSubmit}>
                        
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
                    <button className="btn btn-danger mb-4" onClick={() => signIn("google", { callbackUrl })}>Sign in with Google</button>
                </div>
            </div>
        </div>
    );
}
