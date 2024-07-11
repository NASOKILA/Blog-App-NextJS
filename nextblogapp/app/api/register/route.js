import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    const _requestBody = await req.json();
    
    try {
        await dbConnect();
        const { name, email, password } = _requestBody;

        //Get the user from our MongoDb database
        const existingUser = await User.findOne({ email });
        if(existingUser){
            // If the user exists we return an error
            return NextResponse.json(
                { err: "User already exists" },
                { status: 409 }
            );
        }
        else {
            //if the user does NOT exist, we create it with a hashed password.
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: "user"
            });

            return NextResponse.json(
                { user },
                { status: 201 }
            );
        } 
    }
    catch(err){
        console.log(err);

        return NextResponse.json(
            { err: "Server Error. Try again" },
            { status: 500 }
        );
    }
}