import React, {useState, useEffect, useRef} from 'react';
import {Link} from '@mui/material';
import {usePathname} from 'next/navigation';
import {Logout, PersonOutline} from '@mui/icons-material';
import {signOut, useSession} from 'next-auth/react';

const TopBar = () => {
    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut({callbackUrl: '/'});
    };

    const {data: session} = useSession();
    const user = session?.user;

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-gray-800 text-white">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold">DChat App</h1>
                </div>
                <div className="relative">
                    <div className="flex items-center font-bold">
                        <a
                            href="/chats"
                            className={`ml-4 ${
                                pathname === '/chats'
                                    ? 'bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 uppercase flex items-center justify-center'
                                    : 'text-gray-300 flex items-center justify-center'
                            } text-xl font-bold uppercase`}
                            style={{textDecoration: 'none'}}
                        >
                            CHAT
                        </a>
                        <a
                            href="/contacts"
                            className={`ml-5 mr-5 ${
                                pathname === '/contacts'
                                    ? 'bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 uppercase flex items-center justify-center'
                                    : 'text-gray-300 flex items-center justify-center'
                            } text-xl font-bold uppercase`}
                            style={{textDecoration: 'none'}}
                        >
                            LIÊN HỆ
                        </a>
                        <button
                            className="flex items-center bg-gray-700 px-4 py-2 hover:bg-gray-700 focus:outline-none rounded-xl"
                            onClick={toggleDropdown}
                        >
                            <div className="flex items-center">
                                <img
                                    className="w-9 h-9 rounded-full object-cover object-center mr-2"
                                    src={user?.profileImage || '/assets/person.jpg'}
                                    alt="Avatar"
                                />
                                <span className="text-white">{user?.username}</span>
                            </div>
                            <svg
                                className="w-4 h-4 ml-1 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 11a1 1 0 0 1-.707-.293l-3-3a1 1 0 1 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3A1 1 0 0 1 10 11z"
                                />
                            </svg>
                        </button>
                    </div>

                    {showDropdown && (
                        <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg"
                        >
                            <Link
                                href="/profile"
                                className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200"
                                style={{textDecoration: 'none'}}
                            >
                                <PersonOutline sx={{fontSize: '19px'}}/>
                                <span className="ml-2"> Profile</span>
                            </Link>
                            <a
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200"
                                style={{fontSize: '15px', color: 'red'}}
                            >
                                <Logout sx={{fontSize: '15px', color: 'red'}}/>
                                <span className="ml-2">Đăng xuất</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;