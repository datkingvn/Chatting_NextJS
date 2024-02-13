import {connectToDB} from "@services/mongodb";
import User from "@models/User";
import {hash} from "bcryptjs"

export const POST = async (req, res) => {
    try {
        await connectToDB();

        const body = await req.json();

        const {username, email, password} = body;

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return new Response("Địa chỉ Email này đã tồn tại rồi!", {
                status: 400,
            })
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return new Response(JSON.stringify(newUser), {status: 200})
    } catch (e) {
        console.log(e);
        return new Response("Tạo người dùng thất bại", {
            status: 500,
        })
    }
}