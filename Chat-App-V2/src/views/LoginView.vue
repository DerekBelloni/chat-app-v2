<template>
    <div class="login-bg">
        <div class="container mx-auto">
            <div class="flex justify-center pt-12">
                <div class="flex justify-center mt-12 shadow bg-gray-50 rounded login-card border border-white card">
                    <div class="flex-1">
                        <div class="flex flex-col">
                            <div class="mt-6 text-center">
                                <span class="text-slate-900 text-3xl font-medium">Login</span>
                            </div>
                            <div class="flex flex-col">
                                <div class="mt-12 mx-6 flex justify-center">
                                    <input v-model="credentials.email" type="text" class="pl-4 w-3/4" :class="credentialErrors.email ? 'border border-red-500' : '' " placeholder="Email" required/>
                                </div>
                                <div class="text-center">
                                    <span v-if="credentialErrors.email" class="text-red-500 text-xs italic">{{errorMessage}}</span>
                                </div>
                            </div>
                            <div class="mt-8 mx-6 flex flex-col">
                                <div class="flex justify-center">
                                    <input v-model="credentials.password" type="password" class="pl-4 w-3/4" :class="credentialErrors.password ? 'border border-red-500' : '' " placeholder="Password" required/>
                                </div>
                                <div>
                                    <div class="text-center">
                                        <span v-if="credentialErrors.password" class="text-red-500 text-xs italic">{{errorMessage}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-12 mx-6">
                                <div class="text-center">
                                    <button @click="login()" class="rounded-full px-12 py-2 shadow-lg cursor-pointer bg-slate-800 text-white signin-btn">Sign In</button>
                                </div>
                                <div class="flex justify-center mt-2 mr-2">
                                    <div class="flex flex-col text-center">
                                        <router-link to="/register"><span class="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">No Account? Sign Up</span></router-link>
                                        <span class="text-slate-400 text-xs hover:text-slate-600 cursor-pointer">Forgot Password?</span>
                                    </div>
                                </div>
                                <div class="border-b border-slate-400 w-3/4 ml-12 mt-6"></div>
                                <div class="text-center mt-10 flex justify-center">
                                    <div id="buttonDiv"></div>
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
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { reactive, onMounted, onUnmounted, ref } from 'vue';
import { authService } from '../services/AuthService';
import { useUserStore } from '@/stores/useUserStore';
import { initializeSocket, state } from "../services/SocketService";
import { useToast } from "vue-toastification";
import { validateCredentials } from "../composables/validateCredentials.js";
import _ from 'lodash';

const userStore = useUserStore();
const router = useRouter();
const toast = useToast();

let credentialErrors = reactive({
    email: null,
    password: null
});

let errorMessage = ref("Field can't be blank");

let credentials = reactive({
    email: null,
    password: null
});

onMounted(async() => {
    await loadGoogleScript();

    google.accounts.id.initialize({
        client_id: "47568187069-14lf4ftpne5lqlgfqltjep1dqb60ocvp.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", shape: "pill" } 
    );
    google.accounts.id.prompt();
})

onUnmounted(() => {
    google.accounts.id.cancel();
    delete window.handleCredentialResponse;
})

async function handleCredentialResponse(response) {
    await authService.googleLogin(response)
    initializeSocket(userStore.id);
    router.push('/chat');
}

async function login() {
    const errors = validateCredentials(credentials);

    for (let key in errors) {
        if (errors.hasOwnProperty(key)) {
            credentialErrors[key] = errors[key];
        }
    }

    if (credentialErrors.email || credentialErrors.password) {
        return;
    }
    
    const response = await authService.login(credentials);
    
    if (!response.success) {
        toast.error('Invalid email or password');
        return;
    }

    initializeSocket();
    router.push('/chat');
}  


function loadGoogleScript() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

function register() {
    router.push('/register');
}
</script>

<style scoped>
    .login-card {
        height: 65vh;
        width: 33%;
    }
    .signin-btn {
        width: 57%;
    }
    input:focus {
        outline: none; /* Removes the default focus highlight */
    }
    input {
        padding: 10px;
        padding-left: 15px;
        border-radius: 10px;
        box-shadow: 0 0 15px 4px rgba(0,0,0,0.06);
    }

</style>