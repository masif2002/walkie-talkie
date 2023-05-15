import App from './App.vue'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire'

import HomeComponent from './components/HomeComponent'
import ChatRoom from './components/ChatRoom'

import { firebaseApp, auth } from './firebase'
import { roomExists } from './utils'

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';


const routes = [
    { 
        path: '/', 
        component: HomeComponent,
        name: 'home'
    },
    { 
        path: '/chat/:id', 
        component: ChatRoom, 
        name: 'chat',
        beforeEnter: async (to) => {
            // Check if User is logged in 
            auth.onAuthStateChanged(function (user) {
                if (!user) return { name: 'home' }
            })
            
            // Check if Room with the ID exists
            const room = await roomExists(to.params.id)  
            if (!room) {
                return { name: 'home' }
            }    
        }
    },
]

// Router Set Up
const router = createRouter({
    history: createWebHashHistory(),
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
