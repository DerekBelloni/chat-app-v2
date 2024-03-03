import { api } from "./AxiosService.js";
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore} from '@/stores/useUserStore';
import { setDataStores } from '../composables/storageHelper.js';

class UserService {
    async register(body) {
        try {
            const response = await api.post('/register', body);
            setDataStores(response);
        } catch (error) {
            console.error('Error registering new user: ', error);
        }
    }

    async googleRegistration(googleRes) {
        try {
            const response = await api.post('/register/google', googleRes);
            setDataStores(response);
        } catch (error) {
            console.error('Error registering new user with google: ', error);
        }
    }

    async getAllUsers() {
        const userStore = useUserStore();

        await api.get('/users/all')
            .then((response) => {
                const users = response.data;

                // I can probably modify 'setDataStores' to accomodate this
                users.forEach((newUser) => {
                    if (!userStore.allUsers.some(user => user._id === newUser._id)) {
                        userStore.allUsers.push(newUser);
                    }
                });
            })
            .catch((error) => {
                console.log("Error retrieving all users: ", error);
            })
    }
}

export const userService = new UserService();