import {connectToDB} from "@services/mongodb";
import Chat from "@models/Chat";
import User from "@models/User";

export const GET = async (req, {params}) => {
    try {
        await connectToDB();

        const {userId, query} = params;


        const searchedChat = await Chat.find({
            members: userId,
            nameGroupChat: { $regex: query, $options: "i" }
        }).populate({
            path: "members",
            model: User,
        }).exec();

        return new Response(JSON.stringify(searchedChat), {status: 200})
    } catch (e) {
        console.log(e);
        return new Response("Thất bại khi tìm kiếm tin nhắn!", {status: 500})
    }
}
