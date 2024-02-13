"use client"
import React from 'react';
import {useSession} from "next-auth/react";
import TopBar from "@components/TopBar";

const Chats = () => {
    const {data: session} = useSession()
    console.log(session)
    return (
        <div>
            <TopBar/>
            Chats
        </div>
    );
};

export default Chats;
