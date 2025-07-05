import { Client, Databases, Query, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
    .setProject('YOUR_PROJECT_ID'); // Your project ID

const databases = new Databases(client);
const CHAT_DATABASE_ID = 'chats';
const MESSAGES_COLLECTION_ID = 'messages';

export { databases, CHAT_DATABASE_ID, MESSAGES_COLLECTION_ID, Query, ID }; 