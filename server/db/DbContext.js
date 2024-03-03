import { User } from '../models/User.js';
import { Message } from '../models/Message.js';
import { DirectMessage } from '../models/DirectMessage.js';
import { ChatRoom } from '../models/ChatRoom.js';

class DbContext {
    ChatRoom = ChatRoom;
    DirectMessage = DirectMessage;
    User = User;
    Message = Message;
}

export const dbContext = new DbContext();