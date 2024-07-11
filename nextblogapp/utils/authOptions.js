import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/dbConnect';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
    session: {
        strategy: "jwt", // with this strategy we can add more information about the user
    },
    providers: [
        GoogleProvider({clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET}),
        CredentialsProvider({
            async authorize(credentials) {
                try {
                    await dbConnect();
                    const { email, password } = credentials;
                    const user = await User.findOne({ email });

                    if (!user) {
                        console.log(`No user found with "${email}".`)
                        throw new Error(`No user found with "${email}".`);
                    }

                    const isValid = await bcrypt.compare(password, user.password);

                    if (!isValid) {
                        throw new Error("Password is incorrect.");
                    }

                    console.log(`User is logged in correctly.`)

                    return user;
                }
                catch (error) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        // Create or update user if they login via social networks.
        // Add additional information to the user object session, we will use JWT or the Session.
        async signIn({user}) {
            await dbConnect();
            const { email } = user; // Get the email from the user object

            // Find the user in the database
            let foundUser = await User.findOne({ email });
            
            if(!foundUser) {
                console.log(`User Does Not Exist.`)
                // If the user is not found, we create a new user.
                foundUser = await User.create({
                    email: user.email,
                    name: user.name,
                    image: user.image,
                });
            }

            return true;
        },
        //Add more information to the token and session.
        jwt: async ({token, user}) =>  {
            
            const { name, email } = token;
            const userByEmail = await User.findOne({ email });
            
            if (userByEmail) {
                userByEmail.password = undefined; // This way we do NOT expose the password.
                token.user = userByEmail; // We set the user from the database in the token.
            }

            return token;
        },
        session: async ({session, token}) => { // The session and the token have both information about the user.

            // We already have the DB user stored in the Token. Now we set the User from the Token in the Session.
            session.user = token.user;
            return session;
        }

    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        signOut: "/",
    },
} 