import {connectToDB} from "@services/mongodb";
import Chat from "@models/Chat";
import User from "@models/User";
import Message from "@models/Message";

export const GET = async (req, {params}) => {
    try {
        await connectToDB();

        const {userId} = params;

        const allChats = await Chat.find({members: userId}).sort({lastMessageAt: -1}).populate({
            path: "members",
            model: User
        }).populate({
            path: "messages",
            model: Message,
            populate: {
                path: "sender seenBy",
                model: User,
            },
        }).exec();

        return new Response(JSON.stringify(allChats), {status: 200})
    } catch (e) {
        console.log(e);
        return new Response("Thất bại khi lấy dữ liệu tất cả tin nhắn của người dùng này!", {status: 500})
    }
}