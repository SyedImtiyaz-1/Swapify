'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Dummy messages data
const dummyMessages = [
    {
        id: '1',
        content: 'Hi, is this still available?',
        senderId: 'seller123',
        senderName: 'Seller',
        createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: '2',
        content: 'Yes, it is!',
        senderId: 'buyer123',
        senderName: 'You',
        createdAt: new Date(Date.now() - 3500000).toISOString()
    },
    {
        id: '3',
        content: 'Can we negotiate the price?',
        senderId: 'buyer123',
        senderName: 'You',
        createdAt: new Date(Date.now() - 3400000).toISOString()
    }
];

export default function ChatWindow({ chatId }) {
    const [messages, setMessages] = useState(dummyMessages);
    const [newMessage, setNewMessage] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    // Automatically set the message from query params
    useEffect(() => {
        const initialMessage = searchParams.get('message');
        if (initialMessage) {
            setNewMessage(decodeURIComponent(initialMessage));
        }
    }, [searchParams]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsg = {
            id: Date.now().toString(),
            content: newMessage,
            senderId: 'buyer123',
            senderName: 'You',
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Mobile header with back button */}
            <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-700">
                <button 
                    onClick={() => router.push('/chat')}
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                    Back to Chats
                </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message) => (
                    <div key={message.id} className={`mb-4 ${message.senderId === 'buyer123' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block max-w-[70%] p-3 rounded-lg ${
                            message.senderId === 'buyer123' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                            <p className="text-sm">{message.content}</p>
                            <span className="text-xs text-gray-400 dark:text-gray-300">
                                {new Date(message.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
} 