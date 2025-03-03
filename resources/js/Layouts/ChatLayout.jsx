import { usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline"; 
import TextInput from "@/Components/TextInput";


function ChatLayout({ children }) {
    const page = usePage();
    const conservations = page.props.conservations;
    const selectedConservations = page.props.selectedConservations;
    const [localConservations, setLocalConservations] = useState([]);
    const [sortedConservations, setSortedConservations] = useState([]);
    const [onlineusers, setOnlineUsers] = useState({});

    const isUserOnline = (userId) => onlineusers[userId];

    useEffect(() => {
        setSortedConservations(
            localConservations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? -1 : 1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }

                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localCompare(
                        a.last_message_date
                    );
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    });

    useEffect(() => {
        setLocalConservations(conservations);
    }, [conservations]);

    console.log("conservations", conservations);
    console.log("selectedconservations", selectedConservations);

    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );

                setOnlineUsers((preOnlineUsers) => {
                    return { ...preOnlineUsers, ...onlineUsersObj };
                });
            })
            .joining((user) => {
                setOnlineUsers((preOnlineUsers) => {
                    const updatedUsers = { ...preOnlineUsers };
                    updatedUsers[user.id] = user;
                    return updatedUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((preOnlineUsers) => {
                    const updatedUsers = { ...preOnlineUsers };
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            })
            .error((error) => {
                console.log("error", error);
            });

        return () => {
            Echo.leave("online");
        };
    }, []);

    const onSearch =() =>{
        console.log('search')
    }

    return (
        <>
            <div className="flex-1 w-full flex overflow-hidden">
                <div
                    className={`transistion-all w-full sm:w-[220] ms:w-[300px] bg-slate-800 flex flex-col overflow-hidden 
                    ${selectedConservations ? "-ml-[100%] sm:ml-0" : ""}
                        `}
                >
                    <div className="flex items-center justify-between py-2 px-3 text-xl font-medium">
                        <div className="flex items-center justify-between py-3 px-3 text-xl">
                            My Conservations
                            <div
                                className="tooltip tooltip-left"
                                data-tip="Create new Group"
                            >
                                <button className="text-gray-400 hover:text-gray-200">
                                    <PencilSquareIcon className="w-4 h-4 inline-block ml-2" />
                                </button>
                            </div>
                            <div className="p-3">
                                <TextInput 
                                onKeyUp={onSearch}
                                placeholder="Filter users and groups"
                                className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden"></div>
            </div>
        </>
    );
}

export default ChatLayout;
