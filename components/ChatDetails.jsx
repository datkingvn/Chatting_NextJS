"use client"
import React, {useEffect, useRef, useState} from 'react';
import {useSession} from "next-auth/react";
import Loader from "@components/Loader";
import {Link} from "@mui/material";
import {AddPhotoAlternateOutlined, Send} from "@mui/icons-material";
import {CldUploadButton} from "next-cloudinary";
import MessageBox from "@components/MessageBox";
import {pusherClient} from "@lib/pusher";

const ChatDetails = ({chatId}) => {

    const {data: session} = useSession();
    const currentUser = session?.user;

    const [loading, setLoading] = useState(true);
    const [chat, setChat] = useState({});
    const [otherMembers, setOtherMembers] = useState([]);
    const [text, setText] = useState("")

    const getChatDetails = async () => {
        try {
            const res = await fetch(`/api/chats/${chatId}`);
            const data = await res.json();
            setChat(data);
            setOtherMembers(data?.members?.filter((member) => member._id !== currentUser?._id))
            setLoading(false)
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (currentUser && chatId) {
            getChatDetails()
        }
    }, [currentUser, chatId]);

    const sendText = async () => {
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatId,
                    currentUserId: currentUser._id,
                    text,
                })
            })

            setText("");
        } catch (e) {
            console.log(e)
        }
    }

    const sendPhoto = async (result) => {
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatId,
                    currentUserId: currentUser._id,
                    photo: result?.info?.secure_url,
                })
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        pusherClient.subscribe(chatId);

        const handleMessage = async (newMessage) => {
            setChat((prevChat) => {
                return {
                    ...prevChat,
                    messages: [...prevChat.messages, newMessage],
                };
            });
        };

        pusherClient.bind("new-message", handleMessage)

        return () => {
            pusherClient.unsubscribe(chatId);
            pusherClient.unbind("new-message", handleMessage);
        }
    }, []);

    /* Scrolling down to the bottom when having the new message */
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [chat?.messages]);

    return loading ? <Loader/> : (
        <div className="chat-details">
            <div className="chat-header">
                {chat?.isGroup ? (
                    <>
                        <Link href={`/chats/${chatId}/group-info`}>
                            <img src={chat?.groupPhoto || '/assets/group.png'} alt="Group Image"
                                 className="profilePhoto"/>
                        </Link>
                        <div className="text">
                            <p>
                                {chat?.nameGroupChat} - {chat?.members?.length} thành viên
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        {otherMembers.length > 0 && (
                            <>
                                <img
                                    src={otherMembers[0]?.profileImage || '/assets/person.jpg'}
                                    alt="Profile Image"
                                    className="profilePhoto"
                                />
                                <div className="text">
                                    <p>{otherMembers[0]?.username}</p>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className="chat-body">
                {chat?.messages?.map((message, index) => (
                    <MessageBox
                        key={index}
                        message={message}
                        currentUser={currentUser}
                    />
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="send-message">
                <CldUploadButton options={{maxFiles: 1}} onUpload={sendPhoto}
                                 uploadPreset="dchatapp">
                    <AddPhotoAlternateOutlined className="send-icon"/>
                </CldUploadButton>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-grow px-4 py-2 text-sm text-gray-700 focus:outline-none"
                    required
                />
                <div className="send-button" onClick={sendText}>
                    <Send/>
                </div>
            </div>
        </div>
    );
};

export default ChatDetails;
