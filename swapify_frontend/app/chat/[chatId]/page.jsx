import Header from '@/app/components/header/Header';
import MobileNavigation from '@/app/components/MobileNavigation';
import ChatWindow from '../components/ChatWindow';
import ChatList from '../components/ChatList';
import Link from 'next/link';
import Image from 'next/image';

export default async function ChatPage({ params }) {
    return (
        <div className="flex h-screen mb-[60px] md:mb-2">
            <div className={`w-full md:w-80 ${params.chatId ? 'hidden md:block' : 'block'}`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/assets/Swapify.jpg"
                            alt="Swapify Logo"
                            width={40}
                            height={40}
                            className="rounded"
                        />
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chats</h1>
                    </Link>
                </div>
                <ChatList activeChatId={params.chatId} />
            </div>
            <div className={`flex-1 ${params.chatId ? 'block' : 'hidden md:block'}`}>
                {params.chatId ? (
                    <ChatWindow chatId={params.chatId} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Select a chat to start messaging
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                                Your conversations will appear here
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 