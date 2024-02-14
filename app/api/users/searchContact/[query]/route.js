import {connectToDB} from "@services/mongodb";
import User from "@models/User";

export const GET = async (req, {params}) => {
    try {
        await connectToDB();

        const {query} = params

        const searchedContacts = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        })

        return new Response(JSON.stringify(searchedContacts), {status: 200});
    } catch (e) {
        return new Response("Lỗi - Không thể tìm", {status: 500});
    }
}