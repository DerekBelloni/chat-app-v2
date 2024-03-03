import { Server } from 'socket.io';
import { getUserMapping, setUserMapping, unsetUserMapping } from './RedisService.js';
import { MessageController } from '../controllers/MessageController.js';
import { DirectMessageController } from '../controllers/DirectMessageController.js';
import { ChatRoomController } from '../controllers/ChatRoomController.js';

let io;

// const chatRooms = [];

function init(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5250",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected: ", socket.id);
        const userId = socket.handshake.query.userId;
        setUserMapping(socket.id, userId)

        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
            unsetUserMapping(userId);
        });

        socket.on("message", (message) => {
            console.log("message: ", message);
            MessageController.store(message, userId).then(msgRecord => {
                io.emit("broadcast", msgRecord);
            });
        });

        socket.on("directMessageHistory", async(dmData) => {
            const { sender, receiver} = dmData;
            const receiverId = await getUserMapping(receiver.id);
            const senderId = await getUserMapping(sender.id);

            DirectMessageController.getAll(sender, receiver).then((response) => {
                io.to(senderId).emit("directMessageHistory", response);
                io.to(receiverId).emit("directMessageHistory", response);
            })
        })

        socket.on("directMessage", async(directMessage) => {
            const receiverId = await getUserMapping(directMessage.receiverId);
            const senderId = await getUserMapping(directMessage.userId);

            DirectMessageController.store(directMessage).then(directMessage => {
                if (receiverId) {
                    io.to(receiverId).emit("directMessage", directMessage);
                }
                if (senderId) {
                    io.to(senderId).emit("directMessage", directMessage);
                }
            })
        });

        socket.on("createChatRoom", async(newChatRoom) => {
            const chatRoom = await ChatRoomController.create(newChatRoom);
            io.emit("newChatRoom", chatRoom);
        })

        socket.on("getAllChatRooms", async (userId) => {
            const chatRooms = await ChatRoomController.getAll();
            const userSocketId = await getUserMapping(userId);
            io.to(userSocketId).emit("allChatRooms", chatRooms);
        })

        socket.on("joinRoom", (data) => {
            console.log('room in backend socket: ', data);
            socket.join(data.room.name);

            MessageController.get(data).then((messages) => {
                socket.emit("messageHistory", messages);
            });
        })

        socket.on("markRead", async (readMsg) => {
            console.log('message in server: ', readMsg);
            const message = await DirectMessageController.update(readMsg);
        });

        socket.on("unreadDirectMessages", () => {
            DirectMessageController.getUnread().then((response) => {
                console.log('response for unread dms: ', response);
                socket.emit("unreadDirectMessages", response);
            })
        })
    });
    return io;
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}

export { init, getIO };