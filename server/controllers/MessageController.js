import { messageService } from "../services/MessageService.js";

export class MessageController {
    static async store(message) {
        try {
            const serverMessage = await messageService.store(message);
            return serverMessage;
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    static async get(data) {
        try {
           const messages = await messageService.get(data);
           return messages;
        } catch (error) {
            console.log('Error: ', error);
        }
    }
}