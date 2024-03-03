import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/useAuthStore'; 

export function setDataStores(response) {
    let userStore = useUserStore();
    let authStore = useAuthStore();

    const token = response.headers['x-auth-token'];
    localStorage.setItem('token', token);

    userStore.email = response.data.email;
    userStore.username = response.data.username;
    userStore.id = response.data.id;
    userStore.profilePicture = response.data.profilePic;
    
    authStore.token = token;
    authStore.isLoggedIn = true;
    
    localStorage.setItem('userStoreState', JSON.stringify(userStore));
}
