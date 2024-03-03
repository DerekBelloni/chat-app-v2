import { dbContext } from '../db/DbContext.js';
import { User } from '../models/User.js';
import { DirectMessage } from '../models/DirectMessage.js';
import _ from 'lodash';

class DirectMessageService {
    async store(data) {
        const receiver = await User.findById(data.receiverId).select("-password");

        let directMessage = new dbContext.DirectMessage({
            body: data.message.value,
            sender: {
                email: data.email,
                id: data.userId,
                username: data.username
            },
            receiver: {
                email: receiver.email,
                id: receiver.id,
                username: receiver.username
            }
        });
        
        directMessage.save();

        return directMessage;
    }

    async getAll(sender, receiver) {
        // convert to dbContext instead of pulling the model directly, be consistent
        const messageHistory = await DirectMessage.find({
            $or: [
                { 'sender.id': sender.id, 'receiver.id': receiver.id },
                { 'sender.id': receiver.id, 'receiver.id': sender.id },
            ]
        }).sort({ timestamp: 1});

        return messageHistory;
    }

    async getUnread() {
        const unreadDMs = await DirectMessage.find({ read: false });
        return unreadDMs;
    }

    async markAsRead(readMsg) {
        readMsg.read = true;
        const updatedMsg = await DirectMessage.findByIdAndUpdate(readMsg._id, readMsg, { new: true});
    }
}

export const directMessageService = new DirectMessageService();