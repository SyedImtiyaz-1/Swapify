'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

export default function MessageBox({ listing }) {
    const [message, setMessage] = useState('Hi, is this available?');
    const router = useRouter();
    // Track when the component is mounted to safely use document.body
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSendMessage = () => {
        // Create chat ID and redirect to chat with message as query param
        const chatId = `dummy_chat_${listing._id}`;
        router.push(`/chat/${chatId}?message=${encodeURIComponent(message)}`);
    };

    return (
        <>
            {/* Desktop Message Box - Original Layout */}
            <div className="hidden md:block w-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                    <div className="mb-4">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            rows="3"
                            placeholder="Write your message..."
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                        </svg>
                        Send Message
                    </button>
                </div>
            </div>

            {/* Mobile Sticky Message Box - Fixed to viewport using Portal */}
            {mounted && createPortal(
                (
                <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="flex gap-2 max-w-lg mx-auto">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Write your message..."
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                ),
                document.body
            )}
        </>
    );
} 