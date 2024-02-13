import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import {connectToDB} from "@services/mongodb";
import bcrypt from "bcryptjs"
import User from "@models/User";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
                name: 'Credentials',
                async authorize(credentials, req) {
                    if (!credentials.email || !credentials.password) {
                        throw new Error("Email hoặc mật khẩu không hợp lệ!")
                    }

                    await connectToDB();

                    const user = await User.findOne({email: credentials.email});
                    if (!user || !user?.password) {
                        throw new Error("Email hoặc mật khẩu không hợp lệ!")
                    }

                    const isMatchedPassword = await bcrypt.compare(credentials.password, user.password)
                    if (!isMatchedPassword) {
                        throw new Error("Mật khẩu không chính xác!")
                    }

                    return user
                }
            }
        )
    ],

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async session({session}){
            const mongodbUser = await User.findOne({email: session.user.email});
            session.user.id = mongodbUser._id.toString();

            session.user = {...session.user, ...mongodbUser._doc};

            return session
        }
    }
})

export {handler as GET, handler as POST}
