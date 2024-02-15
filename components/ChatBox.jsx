import React from 'react';
import {format} from "date-fns";
import {useRouter} from "next/navigation";

const ChatBox = ({chat, currentUser, currentChatId}) => {
    const otherMembers = chat?.members?.filter(
        (member) => member._id !== currentUser._id
    );

    const lastMessage = chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1];

    const seen = lastMessage?.seenBy?.find((member) => member?._id === currentUser._id)

    const router = useRouter();

    return (
        <div className={`chat-box ${chat._id === currentChatId ? "bg-blue-2" : ""}`}
             onClick={() => router.push(`/chats/${chat._id}`)}>
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

                    {lastMessage?.photo ? (
                        lastMessage?.sender?._id === currentUser._id ? (
                            <p className="text-small-medium text-grey-3">Bạn vừa gửi một ảnh.</p>
                        ) : (
                            <p className={`${seen ? "text-small-medium text-grey-3" : "text-small-bold"}`}>
                                Đã nhận được một bức ảnh
                            </p>
                        )
                    ) : (
                        <p className={`last-message ${seen ? "text-small-medium text-grey-3" : "text-small-bold"}`}>
                            {lastMessage?.text}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <div className="text-base-light text-gray-3">
                    {
                        !lastMessage ? format(new Date(chat?.createAt), "p") :
                            format(new Date(chat?.lastMessageAt), "p")
                    }
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
