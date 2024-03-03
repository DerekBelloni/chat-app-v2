import { api } from "./AxiosService.js";
import { state } from "./SocketService.js";

class ChatRoomService {
    async getAll() {
        console.log('tomato');
     
        await api.get('/chatrooms/get')
            .then((response) => {
                console.log('response in then block: ', response);
            })
    }
}

export const chatRoomService = new ChatRoomService();