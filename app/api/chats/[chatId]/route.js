import {connectToDB} from "@services/mongodb";
import Chat from "@models/Chat";
import User from "@models/User";
import Message from "@models/Message";

export const GET = async (req, {params}) => {
    try {
        await connectToDB();

        const {chatId} = params;

        const chatData = await Chat.findById(chatId).populate({
            path: 'members',
            model: User
        }).populate({
            path: "messages",
            model: Message,
            populate: {
                path: "sender seenBy",
                model: User
            }
        }).exec();

        return new Response(JSON.stringify(chatData), {status: 200})
    } catch (e) {
        console.log(e);
        return new Response("Thất bại khi lấy thông tin", {status: 200})
    }
}

export const POST = async (req, { params }) => {
    try {
        await connectToDB();

        const { chatId } = params;

        const body = await req.json();

        const { currentUserId } = body;

        await Message.updateMany(
            { chat: chatId },
            { $addToSet: { seenBy: currentUserId } }
        ).populate({
                path: "sender seenBy",
                model: User,
            })
            .exec();

        return new Response("Đã xem tất cả tin nhắn bởi người dùng hiện tại!", { status: 200 });
    } catch (err) {
        console.log(err);
        return new Response("Failed to update seen messages", { status: 500 });
    }
};