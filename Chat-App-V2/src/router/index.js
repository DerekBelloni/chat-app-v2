import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import ChatView from '../views/ChatView.vue'
import { useAuthStore } from '../stores/useAuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'home',
      component: RegisterView
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  await waitForInitialization(); 
  const publicPages = ['/', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const authStore = useAuthStore();

  if (authRequired && !authStore.isLoggedIn) {
    next({ name: 'login'})
  } else {
    next();
  }
})

function waitForInitialization() {
    return new Promise((resolve) => {
        const check = () => {
            if (useAuthStore().initialized) {
                resolve();
            } else {
                setTimeout(check, 100); // Check every 100ms
            }
        };
        check();
    });
}

export default router
