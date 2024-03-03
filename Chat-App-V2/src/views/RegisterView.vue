<template>
    <div class="registration-bg">
        <div class="container mx-auto">
            <div class="flex justify-start pt-8">
                 <a @click="goToLogin()"><font-awesome-icon class="text-gray-400 hover:text-amber-500 h-6 w-6 cursor-pointer" icon="fa-regular fa-circle-left" /></a>      
            </div>
            <div class="flex justify-center">
                <div class="flex justify-center mt-12 shadow bg-gray-100 rounded login-card border border-white card">
                    <div class="flex-1">
                        <div class="flex flex-col">
                            <div class="mt-6 text-center">
                                <span class="text-slate-900 text-3xl font-medium">Register</span>
                            </div>
                            <div class="mt-12 mx-6 flex flex-col">
                                <div class="flex justify-center">
                                    <input v-model="credentials.username" type="text" class="pl-4 w-3/4" :class="credentialErrors.username ? 'border border-red-500' : '' " placeholder="Username"/>                           
                                </div>
                                <div class="text-center">
                                    <span v-if="credentialErrors.password" class="text-red-500 text-xs italic">{{errorMessage}}</span>
                                </div>
                            </div>
                            <div class="mt-4 mx-6 flex flex-col">
                                <div class="flex justify-center">
                                    <input v-model="credentials.email" type="text" class="pl-4 w-3/4" :class="credentialErrors.email ? 'border border-red-500' : '' " placeholder="Email"/>
                                </div>
                                <div class="text-center">
                                    <span v-if="credentialErrors.password" class="text-red-500 text-xs italic">{{errorMessage}}</span>
                                </div>
                            </div>
                            <div class="mt-4 mx-6 flex flex-col">
                                <div class="flex justify-center">
                                    <input v-model="credentials.password" type="password" class="pl-4 w-3/4" :class="credentialErrors.password ? 'border border-red-500' : '' " placeholder="Password"/>
                                </div>
                                <div class="text-center">
                                    <span v-if="credentialErrors.password" class="text-red-500 text-xs italic">{{errorMessage}}</span>
                                </div>
                            </div>
                            <div class="mt-4 mx-6 flex flex-col">
                                <div class="flex justify-center">
                                    <input v-model="confirmPassword" type="password" class="pl-4 w-3/4" :class="credentialErrors.password ? 'border border-red-500' : '' " placeholder="Confirm Password"/>
                                </div>
                                <div class="text-center">
                                    <span v-if="credentialErrors.password" class="text-red-500 text-xs italic">{{errorMessage}}</span>
                                </div>
                            </div>
                            <div class="mt-16 mx-6">
                                <div class="text-center">
                                    <button @click="register()" class="rounded-full px-12 py-2 shadow-lg cursor-pointer bg-slate-800 text-white signup-btn">Sign Up</button>
                                </div>
                                <div class="border-b border-slate-400 w-3/4 ml-12 mt-8"></div>
                                <div class="text-center mt-8 flex justify-center">
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
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { userService } from '../services/UserService';
import { validateCredentials } from "../composables/validateCredentials.js";
import _ from 'lodash';

const router = useRouter();
let googleAcct = ref({});

let credentials = reactive({
    username: '',
    email: '',
    password: '',
});

let confirmPassword = ref(null);

let credentialErrors = reactive({
    username: false,
    email: false,
    password: false,
    confPass: false
});

let errorMessage = ref("Field can't be blank");


onMounted(() => {
    google.accounts.id.initialize({
        client_id: "47568187069-14lf4ftpne5lqlgfqltjep1dqb60ocvp.apps.googleusercontent.com",
        callback: signUpWithCredentials,
        auto_select: false
    });
    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", shape: "pill", text: 'signup_with' }
    );
});

onUnmounted(() => {
    delete window.handleCredentialResponse;
    google.accounts.id.cancel();
})

async function register() {
    const errors = validateCredentials(credentials);

    for (let key in errors) {
        if (errors.hasOwnProperty(key)) {
            credentialErrors[key] = errors[key];
        }
    }

    if (!confirmPassword) {
        credentialErrors[confPass] = true;
    }

    if (Object.values(credentialErrors).some(value => value === true)) {
        return;
    }

    if (credentials.password !== confirmPassword.value) {
        registrationError = "Passwords do not match";
        return;
    }

    await userService.register(credentials);
    router.push('/chat');
}

async function signUpWithCredentials(response) {
    await userService.googleRegistration(response);
    router.push('/chat');
}

function goToLogin() {
    router.push('/');
}

</script>

<style scoped>
    .login-card {
        height: 80vh;
        width: 35%;
    }
    .signup-btn {
        width: 52%;
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