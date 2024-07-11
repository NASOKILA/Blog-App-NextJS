
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

//export { default } from "next-auth/middleware";

// Now we to list the protected routes in the config object
// The middleware will automatically redirect them to the login page.
// There is a callbackUrl property that we can use to redirect the user back to the protected route after they log in.

// We need to protect the admin dashboard routes and implement Role Based Authorization.
export const config = { matcher:[ 
    "/dashboard/user/:path*", // UI route
    "/dashboard/admin/:path*",  // UI route
    "/api/user/:path*", // API route
    "/api/admin/:path*"  // API route
]};

export default withAuth(
    async function middleware(req){
        const url = req.nextUrl.pathname;
        // Check if the user is authenticated
        const userRole = req.nextauth.token.user.role;
        
        // cors policy
        if(url?.includes("api")){
            NextResponse.nect().headers.append("Access-Control-Allow-Origin", "*");
        }

        // If the user is not authorized to see any admin page, we redirect them to the home page. They should not be accessing that Admin page.
        if(url.includes("admin") && userRole !== "admin"){
            return NextResponse.redirect(new URL("/", req.url)); //req.url is the callbackUrl url
        }
    }, 
    {
        callbacks: {
            authorized: ({token}) => {
                if(!token) // This callback checks if there is a token. Without a token, the user is not authorized.
                return false;
            }
        }
    });