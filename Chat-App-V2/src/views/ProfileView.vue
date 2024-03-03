<template>
    <div class="profile-bg relative">
        <div class="absolute inset-0 flex justify-center items-center">
            <div class="bg-zinc-900 border border-gray-800 rounded-lg profile-card">
                <div class="flex flex-row justify-center mt-16 relative">
                    <div class="h-36 w-36 rounded-full bg-gray-200 flex justify-center items-center">
                        <div v-if="userStore.profilePicture">
                            <img class="rounded-full h-36 w-36" :src="imageUrl[userStore.profilePicture]" alt="">
                        </div>
                        <div v-else-if="!userStore.profilePicture && loading.value == false">
                            <font-awesome-icon class="text-blue-600 border-blue-600 border rounded-full p-4 h-24 w-24 text-6xl" icon="fa-solid fa-user-astronaut" />
                        </div>
                    </div>
                    <div class="absolute top-5 right-16 transform -translate-x-12 -translate-y-1/2">
                        <a @click="triggerFileInput()"><font-awesome-icon class="text-emerald-500 hover:text-white bg-zinc-800 hover:bg-emerald-500  border border-emerald-500 rounded-full p-1 h-2 w-2 cursor-pointer" icon="fa-solid fa-plus" /></a>
                        <input type="file" ref="fileInput" class="hidden" @change="event => uploadProfilePic(event)"/>
                    </div>
                </div>
                <div class="flex flex-col mt-4">
                    <div class="flex justify-center text-center">
                        <span class="text-gray-100">{{username}}</span>
                    </div>
                    <div class="flex justify-center text-center">
                        <span class="text-gray-100 text-sm italic">{{email}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="cursor-pointer">
           <a @click="viewChat" class="absolute top-0 left-0 m-8 text-gray-100 rounded-lg border border-gray-800 bg-zinc-900 px-2 py-1 text-sm">Go Back</a>
        </div>
    </div>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { reactive, onMounted, onUnmounted, ref } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/useAuthStore'
import { profileService } from '../services/ProfileService'
import { imageService } from '../services/ImageService'
import _ from 'lodash';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const { email, username } = userStore;
const fileInput = ref(null);
let imageUrl = ref({});
let loading = ref(false);


onMounted(() => {
    if (!_.isEmpty(userStore.profilePicture)) {
        getProfilePic();
    }
})

function viewChat() {
    router.push('/chat');
}

const triggerFileInput = () => {
    fileInput.value.click();
}

async function getProfilePic() {
    let filename = userStore.profilePicture;
    let userId = userStore.id;
    try {
        const fetchedImage = await imageService.getProfilePic(filename, userId);
        imageUrl.value[filename] = fetchedImage; 
    } catch (error) {
        console.error("Error fetching profile picture: ", error);
    }
}

async function uploadProfilePic(e) {
    loading.value = true;
    let fileToRemove = null;
    let formData = new FormData();

    if (!_.isNull(userStore.profilePicture)) {
        fileToRemove = userStore.profilePicture;
        userStore.profilePicture = null;
        formData.append('fileToRemove', fileToRemove);
    }

    let userId = userStore.id;
    let file = e.target.files[0];
    formData.append('file', file);

    await profileService.store(formData, userId);
    await getProfilePic();
    loading.value = false;
}

</script>

<style scoped>
    .profile-card {
        height: 60vh;
        width: 22%;
    }
</style>