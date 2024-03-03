import { api } from "./AxiosService.js";
import { state } from "./SocketService.js";


// Do I need this?
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