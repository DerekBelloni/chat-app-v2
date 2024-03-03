import { api } from "./AxiosService.js";
import { userService } from '../services/UserService';
import { setDataStores } from '../composables/storageHelper.js';

class AuthService {
    async login(body) {
        try {
            const response = await api.post('/auth', body);
            await userService.getAllUsers(); 
            setDataStores(response);
            return { success: true };
        } catch (error) {
            console.error('Error logging in: ', error.response.data);
            let errorMessage = 'An error occurred during login.';
            if (error.response) {
                errorMessage = error.response.data;
            }
            return { success: false, message: errorMessage };
        }
    }

    async validate(user) {
        const headers = {
            'x-auth-token': user.token
        };

        const response = await api.post('/validate', user, { headers })
        return response;
    }

    async googleLogin(googleRes) {
        try {
            const response = await api.post('/validate/google', googleRes);
            setDataStores(response);
        } catch (error) {
            console.error('Error during Google login: ', error);
        }
    }
}

export const authService = new AuthService();