import type { Actions, PageServerLoad,  } from './$types';
import TelegramBot from 'node-telegram-bot-api';

const token = "6723272379:AAEeBpAquYauL3r7SYnE_9eI0jlyYQHEP4Y" as string;
const chatId = "1289588770" as string;
const bot = new TelegramBot(token, { polling: false });




export const actions: Actions = {
    send: async ({ request }) => {
        const formData = await request.formData();
        const message = formData.get('message') as string;

        try {
            await bot.sendMessage(chatId, message);
            return { success: true, sent: message };
        } catch (err) {
            console.error('Telegram send error:', err);
            return { success: false, error: err.message };
        }
    }
};
