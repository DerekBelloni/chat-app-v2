import './style.css'

import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import { authService } from './services/AuthService';
import { useUserStore} from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/useAuthStore'; 
import Toast from "vue-toastification";
import 'vue-toastification/dist/index.css';
import _ from 'lodash';

import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faEnvelope, faComments, faCircleRight, faCircleLeft } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faXmark, faArrowRightFromBracket, faUserAstronaut} from '@fortawesome/free-solid-svg-icons'
import { initializeSocket, state } from "../src/services/SocketService";

library.add(faUser, faComments, faEnvelope, faCircleRight, faCircleLeft, faPlus, faXmark, faArrowRightFromBracket, faUserAstronaut);

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon);
const pinia = createPinia();

app.use(Toast);
app.use(createPinia())
app.use(router)
app.use(pinia)

let userStore = useUserStore();
let authStore = useAuthStore();

async function initialize() {
    const token = localStorage.getItem('token') ?? null;
    let initComplete = false;
 
    if (_.isNull(token)) {
        initComplete = true;
        authStore.initialized = initComplete;
        return;
    } 
    
    const storedCache = localStorage.getItem('userStoreState');
    const cachedUser = storedCache ? JSON.parse(storedCache) : null;
        
    if (_.isNull(cachedUser.id) || !cachedUser) {
        initComplete = true;
        authStore.initialized = initComplete;
        return;
    } 
        
    cachedUser['token'] = token;
    try {
        const response = await authService.validate(cachedUser);
        console.log('main.js, response: ', response.data);
        setUserAndAuthState(response.data, token);
        initializeSocket();
        initComplete = true;
    } catch (error) {
        console.error('Error during validation:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userStoreState');
        initComplete = true;
    }

    authStore.initialized = initComplete;
}

function setUserAndAuthState(userData, token) {
    userStore.email = userData.email;
    userStore.id = userData._id;
    userStore.username = userData.username;
    userStore.profilePicture = userData.profilePic;
    authStore.isLoggedIn = true;
    authStore.token = token;
}

initialize().then(() => {
    app.mount('#app');
})

