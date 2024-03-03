import { chatRoomService } from "../services/ChatRoomService.js";

export class ChatRoomController {
    static async create(room) {
        try {
            const chatRoom = await chatRoomService.store(room);
            return chatRoom;
        } catch (error) {
            console.log('Error creating chat room: ', error);
        }
    }

    static async getAll() {
        try {
            const chatRooms = await chatRoomService.getAll();
            console.log('controller, rooms: ', chatRooms);
            return chatRooms;
        } catch (error) {
            console.log('Error retrieving all chat rooms: ', error);
        }
    }
}