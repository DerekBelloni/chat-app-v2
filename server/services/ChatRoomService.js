import { dbContext } from "../db/DbContext.js";
// import
import _ from 'lodash';

class ChatRoomService {
    async store(data) {
        let chatRoom = await new dbContext.ChatRoom({
            name: data
        });
        chatRoom.save();

        return chatRoom
    }

    async getAll() {
        const chatRooms = await dbContext.ChatRoom.find();
        return chatRooms;
    }
}

export const chatRoomService = new ChatRoomService();