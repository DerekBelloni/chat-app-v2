import { defineStore } from "pinia";
import { ref } from 'vue';

export const useChatRoomStore = defineStore('chatRoom', () => {
    const allChatRooms = ref([]);

    return { allChatRooms }
});