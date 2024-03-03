import { directMessageService } from "../services/DirecMessageService.js";

export class DirectMessageController {
    static async store(message) {
        try {
            const directMessage = await directMessageService.store(message);
            return directMessage;
        } catch (error) {
            console.log("Error storing direct message: ", error);
        }
    }

    static async getAll(sender, receiver) {
        try {
            const messageHistory = await directMessageService.getAll(sender, receiver);
            return messageHistory;
        } catch (error) {
            console.log("Error retrieving direct message history");
        }
    }

    static async getUnread() {
        try {
            const unreadDMs = await directMessageService.getUnread();
            return unreadDMs;
        } catch (error) {
            console.log("Error retrieving unread direct messages");
        }
    }

    static async update(readMsg) {
        try {
            const message = await directMessageService.markAsRead(readMsg);
        } catch (error) {
            console.log("Erroring marking message as 'read': ", error);
        }
    }
}