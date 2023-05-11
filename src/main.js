import App from './App.vue'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire'

import HomeComponent from './components/HomeComponent'
import ChatRoom from './components/ChatRoom'

import { firebaseApp, auth } from './firebase'


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
        beforeEnter: () => {
            if (!auth.currentUser) return { name: 'home' }
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

app.use(router)

app.mount('#app')
