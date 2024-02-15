import {connectToDB} from "@services/mongodb";
import Message from "@models/Message";
import Chat from "@models/Chat";
import message from "@models/Message";
import User from "@models/User";
import PusherServer from "pusher";
import {pusherServer} from "@lib/pusher";

export const POST = async (req) => {
    try {
        await connectToDB();

        const body = await req.json();

        const {chatId, currentUserId, text, photo} = body;

        const newMessage = await Message.create({
            chat: chatId,
            sender: currentUserId,
            text,
            photo,
            seenBy: currentUserId
        })

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: {messages: newMessage._id},
                $set: {lastMessageAt: newMessage.createdAt}
            },
            {new: true}
        ).populate({
            path: "messages",
            model: Message,
            populate: {path: "sender seenBy", model: User}
        }).populate({
            path: "members",
            model: User,
        }).exec();

        // Kích hoạt sự kiện Pusher cho một cuộc trò chuyện cụ thể về tin nhắn mới
        await PusherServer.trigger(chatId, "new-message", newMessage)

        /* Kích hoạt sự kiện Pusher cho mỗi thành viên trong cuộc trò chuyện về cập nhật trò chuyện với tin nhắn mới nhất */
        const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
        for (const member of updatedChat.members) {
            try {
                await pusherServer.trigger(member._id.toString(), "update-chat", {
                    id: chatId,
                    messages: [lastMessage]
                });
            } catch (err) {
                console.error(`Failed to trigger update-chat event`);
            }
        }

        return new Response(JSON.stringify(newMessage), {status: 200})
    } catch (e) {
        console.log(e)
        return new Response("Thất bại khi tạo tin nhắn", {status: 500})
    }
}