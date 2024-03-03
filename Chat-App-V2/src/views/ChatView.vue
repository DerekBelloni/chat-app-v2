<template>
    <div class="chat-bg">
        <div class="grid grid-cols-12">
            <div class="col-span-1 icon-bar bg-zinc-900 border border-gray-800 mt-2 rounded-lg ml-2 flex flex-col justify-center space-y-16 items-center">
                <div class="cursor-pointer">
                    <a @click="setTab('conversations')"><font-awesome-icon class="text-green-400 hover:text-green-600 border-green-400 hover:border-green-600 border rounded-full p-2 h-5 w-5" icon="fa-regular fa-envelope" /></a>
                </div>
                <div class="cursor-pointer">
                    <a @click="setTab('rooms')"><font-awesome-icon class="text-teal-400 hover:text-teal-600 border-teal-400 hover:border-teal-600 border rounded-full p-2 h-5 w-5" icon="fa-regular fa-comments" /></a>
                </div>
                <div class="cursor-pointer">
                    <a @click="viewProfile()"><font-awesome-icon class="text-indigo-500 hover:text-indigo-700 border-indigo-500 hover:border-indigo-700 border rounded-full p-2 h-5 w-5" icon="fa-regular fa-user" /></a>
                </div>
            </div>
            <div class="col-span-3">
                <div class="container mt-2 ml-2">
                    <div class="bg-zinc-900 border border-gray-800 rounded-lg user-info mb-2">
                        <div class="flex flex-col py-4 pl-4">
                            <div class="flex flex-row items-center space-x-4">
                                <div v-if="userStore.profilePicture">
                                    <img class="rounded-full h-12 w-12" :src="imageUrl[userStore.profilePicture]" alt="">
                                </div>
                                <div v-else>
                                    <font-awesome-icon class="text-cyan-500 border-cyan-500 border rounded-full p-2 h-5 w-5" icon="fa-solid fa-user-astronaut" />
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-gray-100">{{ userStore.username }}</span>
                                    <span class="text-gray-500 text-xs italic">{{ userStore.email }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="left-panel bg-zinc-900 rounded-lg border border-gray-800">
                        <div class="pt-2 px-2">
                            <div class="flex flex-col">
                                <div class="flex flex-col justify-around pr-2 space-y-4">
                                    <div>
                                        <div class="ml-2 mt-4 flex justify-start flex-col" v-if="selectedTab == 'conversations'">   
                                            <span class="text-gray-100 text-lg">Conversations</span> 
                                            <ul v-for="user in userStore.allUsers" :key="user.id" class="divide-x">
                                                <div class="flex flex-row items-end" v-if="user._id !== userStore.id">
                                                    <div class="flex flex-col mt-2">
                                                        <a @click="setDirectMsg(user)" class="flex flex-row items-center">
                                                            <li class="text-gray-100 cursor-pointer pt-1">{{user.username}}</li>
                                                            <div class="pl-2 pt-1"  v-if="user.unreadCount > 0">
                                                                <span class="text-amber-400 text-xs italic">{{user.unreadCount}} unread message(s)</span>
                                                            </div>
                                                        </a>
                                                        <span class="text-xs italic text-gray-400">{{user.email}}</span>
                                                    </div>
                                                </div>
                                            </ul>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-start flex-col ml-2" v-if="selectedTab == 'rooms'">
                                            <div class="flex flex-row items-center">
                                                <span class="text-gray-100 text-lg">Chat Rooms</span>
                                                <div class="cursor-pointer ml-4">
                                                    <a @click="openModal()"><font-awesome-icon class="text-white hover:border rounded-full h-4 w-4" icon="fa-solid fa-plus" /></a>
                                                </div>
                                            </div>
                                            <ul v-for="room in state.rooms" :key="room.id">
                                                <a><li @click="joinRoom(room)" class="text-gray-100 cursor-pointer pt-2 hover:text-amber-400">{{room.name}}</li></a>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="modalDialog">
                                        <dialog id="msgModal" class="bg-zinc-900 border border-zinc-600 rounded-lg text-gray-100 px-4">
                                            <form method="dialog" class="flex flex-col justify-center">
                                                <div class="flex flex-col justify-between mt-2">
                                                    <div class="flex flex-col">
                                                        <div class="flex flex-row justify-between">
                                                            <label for="roomName" class="text-sm">Room Name</label>
                                                            <div class="cursor-pointer ml-4">
                                                               <a @click="closeModal()"><font-awesome-icon class="text-white hover:border hover:border-red-500 hover:text-red-500 rounded-full h-4 w-4" icon="fa-solid fa-xmark" /></a>
                                                            </div>
                                                        </div>
                                                        <input v-model="newChatRoom" id="roomName" class="bg-zinc-300 text-zinc-900 pl-1 rounded mt-1 room-input" type="text"/>
                                                    </div>
                                                    <div class="flex justify-end my-2">
                                                        <button @click="addRoom()" class="text-xs hover:text-lime-300">Add Room</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </dialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-8 mr-2">
                <div class="flex flex-col">
                    <div class="col-start-4">
                        <div class="mt-2 bg-zinc-900 border border-gray-800 rounded-lg chat-box overflow-hidden">
                            <div class="chat-box-header border-b border-zinc-800">
                                <div class="flex flex-row justify-between items-center py-2">
                                    <div class="flex items-baseline" v-if="!_.isNull(activeRoom.value) && !dmFlag">
                                        <span class="text-gray-100 ml-4 text-lg">{{activeRoom.name}}</span>
                                    </div>
                                    <div v-else class="flex flex-col">
                                        <div class="mt-2">
                                            <span class="text-gray-100 ml-4">{{msgUser.username}}</span>
                                        </div>
                                        <div>
                                            <span class="text-gray-500 text-xs italic ml-4">{{msgUser.email}}</span>
                                        </div>
                                    </div>
                                    <div class="mr-4">
                                        <a @click="logout()"><font-awesome-icon class="text-amber-500 rounded-full p-2 h-4 w-4 cursor-pointer" icon="fa-solid fa-arrow-right-from-bracket" /></a>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-black overflow-auto chat-window">
                                <div class="pl-4 pt-4" v-if="!_.isNull(activeRoom.value) && !dmFlag">
                                    <div v-for="message in state.receivedMessages" :key="message.id" class="flex flex-row pb-2" :class="message.client_flag ?  'justify-start  flex-row pb-2 py-2' : 'flex flex-row justify-end pb-2 py-2 pr-2'">
                                        <div class="rounded flex items-center mt-4">
                                            <span :class="message.client_flag ? 'text-gradient-two  font-medium px-2' : 'text-gradient font-medium px-2'">{{message.username}}</span>
                                        </div>
                                        <div class=" ml-1 flex flex-col">
                                            <span class="text-xs text-zinc-500 px-2 italic">{{formattedDate(message.createdAt)}}</span>
                                            <div class="bg-gray-800 rounded">
                                                <span class="text-gray-200 px-2">{{message.body}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="space-y-4">
                                    <div v-for="message in state.directMessages" :key="message.id" v-visible="() => handleVisible(message)" class="flex flex-row pb-2" :class="message.client_flag ?  'justify-start items-center flex-row pb-2 py-2 ml-4' : 'flex flex-row items-center justify-end pb-2 py-2 pr-2'">
                                        <div class="rounded flex flex-col items-center mt-4">
                                            <div v-if="userStore.profilePicture">
                                                <img class="rounded-full h-12 w-12" :src="imageUrl[userStore.profilePicture]" alt="">
                                            </div>
                                            <div v-else>
                                                <font-awesome-icon class="text-cyan-500 border-cyan-500 border rounded-full p-2 h-5 w-5" icon="fa-solid fa-user-astronaut" />
                                            </div>
                                        </div>
                                        <div class="ml-1 flex flex-col">
                                            <div>
                                                <span :class="message.client_flag ? 'text-rose-600 font-medium px-2 text-sm' : 'text-cyan-400 text-sm font-medium px-2'">{{message.sender.username}}</span>
                                                <span class="text-xs text-zinc-500 italic">{{formattedDate(message.createdAt)}}</span>
                                            </div>
                                            <div class="bg-gray-800 rounded ml-2">
                                                <span class="text-gray-200 px-1">{{message.body}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-area">
                                <div class="flex flex-col justify-center pt-6 px-12 border-t border-zinc-800">
                                    <div>
                                        <textarea class="text-chat rounded bg-black border border-zinc-800 text-gray-100" type="text" v-model="message.value"></textarea>
                                    </div>
                                    <div class="mt-2 flex justify-end">
                                        <a @click="sendMessage()"><font-awesome-icon class="text-emerald-400 h-6 w-6 cursor-pointer" icon="fa-regular fa-circle-right" /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { onMounted, onUnmounted, ref, reactive, computed, watch } from 'vue';
import { closeConnection, state } from "../services/SocketService";
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { userService } from '../services/UserService';
import { chatRoomService } from '../services/ChatRoomService';
import { imageService } from '../services/ImageService'
import { vVisible } from '@/directives/VisibleDirective.js';
import _ from 'lodash';
import moment from 'moment';

const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();

// figure out some sort system for these variables
const { id, email, unreadCount, username } = userStore;
const activeRoom = ref('');
const chats = ref();
const directMessage = ref(null);
const dmFlag = ref(false);
const msgModal = ref(false);
const msgUser = ref({});
const newChatRoom = ref(null);
const readMessages = ref([]);
const rooms = [{id: 1, name: 'Room 1'}, {id: 2, name: 'Room 2'}, {id: 3, name: 'Room 3'}];
const selectedTab = ref('');
const message = ref({});
const unreadMsgs = reactive([]);
const users = ref([]);

let imageUrl = ref({});


onMounted(async () => {
    await userService.getAllUsers();
    if (!_.isEmpty(userStore.profilePicture)) {
        getProfilePic();
    }
    state.socket.emit('unreadDirectMessages');
});

watch(() => state.unreadMessages, (newUnreadMessages, oldUnreadMessages) => {
    handleUnreadMessages(newUnreadMessages);
}, { deep: true });

function addRoom() {
    state.socket.emit('createChatRoom', newChatRoom.value);
}

function closeModal() {
    const dialog = document.getElementById('msgModal');
    dialog.close();
}

function openModal() {
    const dialog = document.getElementById('msgModal');
    dialog.showModal();
}


function formattedDate(msgDate) {
    return moment(msgDate).format('MMMM Do YYYY, h:mm:ss a');
}

function viewProfile() {
    router.push('/profile');
}

function handleUnreadMessages(unreadMessages) {
    userStore.allUsers.forEach((user) => {
        unreadMessages.forEach((um) => {
            if (um.sender.id === user._id) {
                const isMessageAlreadyIncluded = unreadMsgs.some(message => message._id === um._id);

                if (!isMessageAlreadyIncluded) {
                    unreadMsgs.push(um);
                    user['unreadCount'] += 1;
                }
            }
        });
    });
}

function handleVisible(message) {
    if (message.read == false) {
        state.socket.emit("markRead", message);
    }
}

function joinRoom(room) {
    dmFlag.value = false;
    activeRoom.value = room;
    
    state.socket.emit("joinRoom", {
        room: room,
        user: {
            id: id,
            email: email,
            username: username
        }
    });

    state.directMessages = [];
    state.receivedMessages = [];
}

function logout() {
    localStorage.removeItem('token');
    resetStores();
    sessionStorage.clear();
    state.receivedMessages = [];
    state.directMessages = [];
    state.rooms = [];
    closeConnection();
    router.push('/');
}

function resetStores() {
    authStore.token = null;
    authStore.isLoggedIn = false;
    userStore.allUsers = [];
    userStore.email = null;
    userStore.id = null;
    userStore.username = null;
}

function setTabStyles(tab) {
    return selectedTab.value !== tab ? 
        'text-gray-100 cursor-pointer' : 
        'text-gray-100 cursor-pointer border-b border-zinc-500';
}

function sendMessage() {
    if (dmFlag.value) {
        sendDirectMessage();
        return;
    }

    const msgData = { message: message.value, username: userStore.username, userId: userStore.id, serverId: activeRoom.value._id, serverName: activeRoom.value.name }
    state.socket.emit("message", msgData);
 
    message.value = {};
}

function setDirectMsg(user) {
    activeRoom.value = '';
    dmFlag.value = true;
    msgUser.value = user;
    state.directMessages = [];
    state.recipient = user;
    user.unreadCount = 0;
    

    const dmData = {
        sender: {id: userStore.id, email: userStore.email, username: userStore.username},
        receiver: {id: user._id, email: user.email, username: user.username}
    }
    state.socket.emit("directMessageHistory", dmData);
}

function sendDirectMessage() {
    const msgData = { message: message.value, username: userStore.username, userId: userStore.id, email: userStore.email, receiverId: msgUser.value._id };
    state.socket.emit("directMessage", msgData);
    message.value = {};
}

function setTab(option) {
    selectedTab.value = option;
    console.log('option: ', option);
    if (option == 'rooms') {
        getChatRooms();
    }
}

async function getChatRooms() {
    const userId = userStore.id;
    state.socket.emit("getAllChatRooms", userId);
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



</script>

<style scoped>
    .icon-bar {
        min-height: 98vh;
        max-height: 98vh;
        width: 92%;
    }

    .text-gradient {
        background-clip: text;
        background-image: linear-gradient(30deg, rgb(205, 242, 0) 0%, rgb(255, 64, 0) 40%, rgb(255, 0, 123) 90%);
        color: transparent;
    }

    .text-gradient-two {
        background-clip: text;
        background-image: linear-gradient(30deg, rgb(15, 242, 111) 0%, rgb(65, 120, 226) 100%);
        color: transparent;
    }

    .left-panel {
        min-height: 88vh;
        max-height: 88.5vh;
        width: 95%;
    }

    .chat-box {
        min-height: 98vh;
        max-height: 98vh;
    }

    .chat-window {
        height: 65vh;
    }

    .chat-box-header {
        min-height: 8vh;
    }

    .room-input {
        outline: none;
    }

    .text-area {
        z-index: 1;
        min-height: 25vh;
    }
    .text-chat {
        min-height: 15vh;
        max-height: 15vh;
        width: 100%;
        outline: none;
    }

    .user-info {
        width: 95%;
    }
    
    /* This styles the scrollbar track */
    .chat-window::-webkit-scrollbar-track {
        background: transparent; /* or any other color */
    }

    /* This styles the scrollbar thumb (the part that you drag) */
    .chat-window::-webkit-scrollbar-thumb {
        background: #888; /* or any other color */
        border-radius: 10px; 
    }

    /* This styles the scrollbar itself */
    .chat-window::-webkit-scrollbar {
        width: 12px; /* or any other size */
        border-radius: 10px; 
    }

    html, body {
        height: 100%;
        overflow: hidden; /* Hide scrollbars and prevent scrolling on the entire page */
      }
</style>