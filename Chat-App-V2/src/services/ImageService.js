import { api } from './AxiosService.js';

class ImageService {
    async getProfilePic(fileName, userId) {
        try {
            const requestBody = { filename: fileName };
            const response = await api.post(`/images/${userId}`, requestBody, {
                responseType: 'arraybuffer'
            });
            if (!response.data || !(response.data instanceof ArrayBuffer)) {
                throw new Error("Unexpected response format from API");
            }

            return new Promise((resolve, reject) => {
                const blob = new Blob([response.data], { type: 'image/webp'});
                const reader = new FileReader();

                reader.onloadend = function() {
                    const base64data = reader.result;
                    resolve(base64data);
                };

                reader.onerror = function() {
                    reject(new Error("Failed to convert image to base64: ", error.message));
                }

                reader.readAsDataURL(blob);
            })
        } catch (error) {
            console.error("Error sending the profile picture filename:", error);
        }
    }
}

export const imageService = new ImageService();