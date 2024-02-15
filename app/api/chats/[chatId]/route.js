import {connectToDB} from "@services/mongodb";
import Chat from "@models/Chat";
import User from "@models/User";

export const GET = async (req, {params}) => {
    try {
        await connectToDB();

        const {chatId} = params;

        const chatData = await Chat.findById(chatId).populate({
            path: 'members',
            model: User
        }).exec();

        return new Response(JSON.stringify(chatData), {status: 200})
    } catch (e) {
        console.log(e);
        return new Response("Thất bại khi lấy thông tin", {status: 200})
    }
}