"use client"
import React, {useEffect} from 'react';
import TopBar from "@components/TopBar";
import {useParams} from "next/navigation";
import {useSession} from "next-auth/react";
import ChatList from "@components/ChatList";
import ChatDetails from "@components/ChatDetails";

const ChatPage = () => {
    const {chatId} = useParams();

    const {data: session} = useSession();
    const currentUser = session?.user;

    const seenMessages = async () => {
        try {
            await fetch(`/api/chats/${chatId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    currentUserId: currentUser._id
                })
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (currentUser && chatId) {
            seenMessages()
        }
    }, [currentUser, chatId]);

    return (
        <>
            <TopBar/>
            <div className="main-container">
                <div className="w-1/3 max-lg:hidden"><ChatList currentChatId={chatId} /></div>
                <div className="w-2/3 max-lg:w-full"><ChatDetails chatId={chatId} /></div>
            </div>
        </>
    );
};

export default ChatPage;
