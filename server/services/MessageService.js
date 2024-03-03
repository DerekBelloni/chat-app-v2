import { dbContext } from '../db/DbContext.js';
import _ from 'lodash';

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
        const serverMessages = await dbContext.Message.find({ serverId: data.room._id });
        console.log('server messages: ', serverMessages);
        return serverMessages;
    }
}

export const messageService = new MessageService(); 