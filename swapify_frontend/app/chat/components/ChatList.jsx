'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Dummy chat data
const dummyChats = [
    {
        id: 'chat1',
        listingId: '123',
        listingTitle: 'iPhone 13 Pro Max',
        lastMessage: 'Yes, it is available!',
        lastMessageTime: '10:30 AM',
        unreadCount: 1,
        sellerName: 'John Doe'
    },
    {
        id: 'chat2',
        listingId: '456',
        listingTitle: 'MacBook Pro 2021',
        lastMessage: 'Can we negotiate the price?',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        sellerName: 'Jane Smith'
    },
    {
        id: 'chat3',
        listingId: '789',
        listingTitle: 'Sony PlayStation 5',
        lastMessage: 'When can I pick it up?',
        lastMessageTime: '2 days ago',
        unreadCount: 3,
        sellerName: 'Mike Johnson'
    }
];

export default function ChatList({ activeChatId }) {
    const router = useRouter();

    const handleChatClick = (chatId) => {
        router.push(`/chat/${chatId}`);
    };

    return (
        <div className="h-screen overflow-y-auto">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {dummyChats.map(chat => (
                    <div
                        key={chat.id}
                        onClick={() => handleChatClick(chat.id)}
                        className={`block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                            activeChatId === chat.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    {chat.listingTitle}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {chat.sellerName}
                                </p>
                            </div>
                            {chat.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                    {chat.unreadCount}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {chat.lastMessage}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {chat.lastMessageTime}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
} 