import { defineStore } from "pinia";
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(null);
    const isLoggedIn = ref(false);
    const initialized = ref(false);

    return {token, isLoggedIn, initialized};
})