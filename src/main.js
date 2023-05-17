import App from './App.vue'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire'

import HomeComponent from './components/HomeComponent'
import LoginComponent from './components/LoginComponent'
import ChatRoom from './components/ChatRoom'

import { firebaseApp,  } from './firebase'
import { checkUserExists, roomExists } from './utils'

import ToastPlugin, { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const toast = useToast()

const routes = [
    { 
        path: '/', 
        component: HomeComponent,
        name: 'home',
        beforeEnter: async () => {
            // Check if User is logged in 
            let user = await checkUserExists()
            if (!user) {
                toast.default('You must be logged in')
                return { name: 'login' }
            }
        }
    },
    { 
        path: '/login', 
        component: LoginComponent,
        name: 'login',
        beforeEnter: async () => {
            let user = await checkUserExists()
            if (user) {
                return { 'name': 'home'}
            }
        }
    },
    { 
        path: '/chat/:id', 
        component: ChatRoom, 
        name: 'chat',
        beforeEnter: async (to) => {
            // Check if User is logged in 
            let user = await checkUserExists()
            if (!user) {
                toast.default('You must be logged in')
                return { name: 'login' }
            }
            
            // Check if Room with the ID exists
            const room = await roomExists(to.params.id)  
            if (!room) {
                toast.error('Room does not exist!')
                return { name: 'home' }
            }    
        }
    },
]

// Router Set Up
const router = createRouter({
    history: createWebHistory(),
    routes
})


const app = createApp(App)

// Firebase Plugin
app.use(VueFire, { 
    firebaseApp, 
    modules: [
        VueFireFirestoreOptionsAPI()
    ]
})

// Toast Notification Plugin
app.use(ToastPlugin);

app.use(router)

app.mount('#app')
