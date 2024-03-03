import { api } from "./AxiosService.js";
import { useUserStore } from '@/stores/useUserStore';

class ProfileService {
    async store(file, userId, fileToRemove) {
        const userStore = useUserStore();
        try {
            // I think I can remove the userId from the body
            const filename = await api.post(`/profile/picture/${userId}/store`, file);
            userStore.profilePicture = filename.data;
        } catch (error) {
            console.error('Error storing profile picture:' , error);
        }
    }
}

export const profileService = new ProfileService();