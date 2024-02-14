import React from 'react';
import {format} from "date-fns";
import {useRouter} from "next/navigation";

const ChatBox = ({chat, currentUser}) => {
    const otherMembers = chat?.members?.filter(
        (member) => member._id !== currentUser._id
    );

    const lastMessage = chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1];

    const router = useRouter();

    return (
        <div className="chat-box" onClick={() => router.push(`/chats/${chat._id}`)}>
            <div className="chat-info">
                {chat?.isGroup ? (
                    <img src={chat?.groupPhoto || "/assets/group.png"} alt="Image Group" className="profilePhoto"/>
                ) : (
                    <img src={otherMembers[0]?.profileImage || "/assets/person.jpg"} alt="Image Person Chat"
                         className="profilePhoto"/>
                )}

                <div className="flex flex-col gap-1">
                    {chat?.isGroup ? (
                        <p className="text-lg font-semibold">{chat?.nameGroupChat}</p>
                    ) : (
                        <p className="text-lg font-semibold">{otherMembers[0]?.username}</p>
                    )}

                    {!lastMessage && (
                        <p className="text-small-bold">Bắt đầu một cuộc trò chuyện.</p>
                    )}
                </div>
            </div>

            <div>
                <div className="text-base-light text-gray-3">
                    {
                        !lastMessage && format(new Date(chat?.createAt), "p")
                    }
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
