"use client"
import React, {useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import Loader from "@components/Loader";
import {CheckCircle, RadioButtonUnchecked} from "@mui/icons-material";
import {red} from "@mui/material/colors";
import {useRouter} from "next/navigation";

const Contacts = () => {
    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");

    const {data: session} = useSession();
    const currentUser = session?.user;

    const getContacts = async () => {
        try {
            const res = await fetch(search !== "" ? `/api/users/searchContact/${search}` : '/api/users');
            const data = await res.json();
            setContacts(data.filter((contact) => contact._id !== currentUser._id))
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (currentUser) getContacts()
    }, [currentUser, search]);

    // SELECT CONTACTS
    const [selectedContacts, setSelectedContacts] = useState([]);
    const isGroup = selectedContacts.length > 1;

    const handleSelect = (selectedContact) => {
        if (selectedContacts.includes(selectedContact)) {
            setSelectedContacts((prevSelectedContacts) =>
                prevSelectedContacts.filter((item) => item !== selectedContact)
            );
        } else {
            setSelectedContacts((prevSelectedContacts) => [
                ...prevSelectedContacts,
                selectedContact,
            ]);
        }
    };

    // ADD GROUP CHAT NAME
    const [nameGroupChat, setNameGroupChat] = useState("");

    // CREATE CHAT
    const router = useRouter()
    const createChat = async () => {
        const res = await fetch("/api/chats", {
            method: "POST",
            body: JSON.stringify({
                currentUserId: currentUser._id,
                members: selectedContacts.map((selectedContact) => selectedContact._id),
                isGroup,
                nameGroupChat
                }
            )
        })

        const chatData = await res.json();

        console.log(chatData)
        if (res.ok) {
            router.push(`/chats/${chatData._id}`)
        }
    }

    return loading ? <Loader/> : (
        <div className="create-chat-container">
            <input placeholder="Tìm kiếm liên hệ..." className="input-search" value={search}
                   onChange={(e) => setSearch(e.target.value)}/>

            <div className="contact-bar">
                <div className="contact-list">
                    <p className="text-body-bold text-gray-800">Chọn Liên Hệ</p>
                    {contacts.map((user, index) => (
                        <div
                            key={index} onClick={() => handleSelect(user)}
                            className="contact flex items-center space-x-2 p-2 hover:bg-gray-100 transition duration-300"
                        >
                            {
                                selectedContacts.find((item) => item === user) ? (
                                    <CheckCircle sx={{color: red}}/>
                                ) : (<RadioButtonUnchecked className="w-5 h-5 text-gray-500"/>)
                            }
                            <img
                                src={user?.profileImage || "/assets/person.jpg"}
                                alt="Profile Photo User"
                                className="profilePhoto"
                            />
                            <p className="text-base-bold text-gray-800">{user.username}</p>
                        </div>
                    ))}
                </div>

                <div className="create-chat">
                    {
                        isGroup && (
                            <>
                                <div className="flex flex-col gap-3">
                                    <p>Tên Group Chat</p>
                                    <input placeholder="Vui lòng đặt tên Group Chat..." className="input-search"
                                           value={nameGroupChat}
                                           onChange={(e) => setNameGroupChat(e.target.value)}/>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <p className="text-body-bold">
                                        Thành Viên
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {
                                            selectedContacts.map((contact, index) => (
                                                <p className="selected-contact" key={index}>{contact.username}</p>
                                            ))
                                        }
                                    </div>
                                </div>
                            </>
                        )
                    }
                    {
                        selectedContacts.length !== 0 && (
                            <button className="btn uppercase" onClick={createChat}>
                                Tìm Hoặc Tạo Cuộc Trò Chuyện Mới
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Contacts;
