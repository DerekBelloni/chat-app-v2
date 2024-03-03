import { dbContext } from '../db/DbContext.js';
import _ from 'lodash';
// import { Message } from '../models/Message.js'

class MessageService {
    async store(data) {
        let serverMsg = new dbContext.Message({
            body: data.message.value,
            username: data.username,
            userId: data.userId,
            serverId: data.serverId
        });
        serverMsg.save();

        return serverMsg;
    }

    async get(data) {
        // console.log('in service layer, data: ', data.room.id);
        // use the serverId to get messages
        const serverMessages = await dbContext.Message.find({ serverId: data.room._id });
        console.log('server messages: ', serverMessages);
        return serverMessages;
    }
}

export const messageService = new MessageService(); 