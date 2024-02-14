import {connectToDB} from "@services/mongodb";
import Chat from "@models/Chat";
import User from "@models/User";

export const POST = async (req) => {
    try {
        await connectToDB();

        const body = await req.json();

        const {currentUserId, members, isGroup, nameGroupChat, groupPhoto} = body;

        // Define "query" to find chat (find ? group chat : private chat)
        const query = isGroup
            ? {
                members: [currentUserId, ...members],
                isGroup,
                nameGroupChat,
                groupPhoto,
            }
            : {
                members: {$all: [currentUserId, ...members], $size: 2},
            };

        let chat = await Chat.findOne(query);

        if (!chat) {
            chat = isGroup ? new Chat(query) : new Chat({members: [currentUserId, ...members]});

            await chat.save();

            const updateAllMembers = chat.members.map(async (memberId) => {
                await User.findByIdAndUpdate(memberId, {
                    $addToSet: {chats: chat._id},
                }, {new: true});
            })

            await Promise.all(updateAllMembers)
        }

        return new Response(JSON.stringify(chat), {status: 200});
    } catch (e) {
        console.log(e);
        return new Response("Thất bại khi tạo Chat mới", {status: 500});
    }
};