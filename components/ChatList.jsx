"use client"
import React, {useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import Loader from "@components/Loader";
import ChatBox from "@components/ChatBox";

const ChatList = ({currentChatId}) => {
    const {data: session} = useSession();
    const currentUser = session?.user;

    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState({});
    const [search, setSearch] = useState("");

    const getChats = async () => {
        try {
            const res = await fetch(
                search !== ""
                    ? `/api/users/${currentUser._id}/searchChat/${search}`
                    : `/api/users/${currentUser._id}`
            );

            const data = await res.json();
            setChats(data);
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (currentUser) {
            getChats()
        }
    }, [currentUser, search]);

    return loading ? <Loader/> : (
        <div className="chat-list">
            <input
                placeholder="Search chat..."
                className="input-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="chats">
                {chats?.map((chat, index) => (
                    <ChatBox chat={chat} index={index} currentUser={currentUser} currentChatId={currentChatId}/>
                ))}
            </div>
        </div>
    );
};

export default ChatList;
