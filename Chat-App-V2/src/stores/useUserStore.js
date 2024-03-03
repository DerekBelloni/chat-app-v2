import { defineStore } from "pinia";
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const email = ref("");
    const username = ref("");
    const id = ref(null);
    const allUsers = ref([]);
    const unreadCount = ref(0);
    const profilePicture = ref("");

    return {allUsers, email, unreadCount, username, id, profilePicture}
});