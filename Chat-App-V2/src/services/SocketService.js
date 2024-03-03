import { io } from "socket.io-client";
import { reactive } from "vue";
import { useUserStore } from '@/stores/useUserStore';
import { useChatRoomStore } from '@/stores/useChatRoomStore';

export const state = reactive({
    connected: false,
    directMessages: [],
    unreadMessages: [],
    receivedMessages: [],
    // change the name of this so it more obvioulsy represents the other user thats been selected by the client
    recipient: null,
    rooms: [],
    socket: null,
    users: []
});

const URL = "http://localhost:5260";

export function initializeSocket(userId) {
    const userStore = useUserStore();
    const chatRoomStore = useChatRoomStore();
    state.socket = io(URL, { query: {
        'userId': userId ?? userStore.id
       }  
    });

    state.socket.on("connect", () => {
        state.connected = true;
        console.log("socket id: ", state.socket.id);

        state.socket.on("allChatRooms", (chatRooms) => {
            const roomsMap = new Map();
            chatRooms.forEach((room) => {
                roomsMap.set(room._id, room);
            });
            state.rooms = Array.from(roomsMap.values());
        })

        state.socket.on("broadcast", (message) => {
            message['client_flag'] = false;
            if (message.userId === userStore.id) {
                message['client_flag'] = true;
            }
            if (!state.receivedMessages.includes(message)) {
                state.receivedMessages.push(message);
            }
        });

        state.socket.on("directMessage", (directMessage) => {
            if (userStore.id === directMessage.sender.id || userStore.id === directMessage.sender.id) {
                directMessage["client_flag"] = true;
            }

            const isCurrentChat = state.recipient && (directMessage.sender.id === state.recipient._id || directMessage.receiver.id === state.recipient._id);
            if (!isCurrentChat) {
               state.unreadMessages.push(directMessage);
            } else {
                directMessage.read = true;
                state.directMessages.push(directMessage);
            }
        })

        state.socket.on("directMessageHistory", (directMessageHistory) => {
            if (state.recipient && directMessageHistory.some(dm => dm.sender.id === state.recipient._id || dm.receiver.id === state.recipient._id)) {
                state.directMessages = directMessageHistory;
                state.directMessages.forEach((dm) => {
                    dm["client_flag"] = false;
                    if (dm.sender.id === userStore.id) {
                        dm["client_flag"] = true;
                    }
                })
            }
        });
        
        // Eventually lets put a cap on how far back the history should go
        state.socket.on("messageHistory", (messages) => {
            const uniqueHistory = messages.filter((msg) => {
                return !state.receivedMessages.some((existingMsg) => existingMsg.id === msg.id);
            });

            state.receivedMessages.unshift(...uniqueHistory);

            state.receivedMessages.forEach((message) => {
                message['client_flag'] = false;
                if (message.userId === userStore.id) {
                    message['client_flag'] = true;
                }
            })
        });

        state.socket.on("newChatRoom", (newChatRoom) => {
            state.rooms.push(newChatRoom);
        })

        state.socket.on("unreadDirectMessages", (response) => {
            console.log('in the client unreadDirectMessages', response);
            state.unreadMessages = response;
        })
    });
}

export function closeConnection() {
    if (state.socket) {
        state.socket.disconnect();
        state.connected = false;
        console.log("Socket connection closed");
    }
}

