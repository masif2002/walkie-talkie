import App from './App.vue'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire'
import vueCompositionApi from '@vue/composition-api'

import HomeComponent from './components/HomeComponent'




const routes = [
    { path: '/', component: HomeComponent}
]

// Router Set Up
const router = createRouter({
    history: createWebHashHistory(),
    routes
})


const app = createApp(App)

// Firebase Plugin
app.use(VueFire, {  
    modules: [VueFireFirestoreOptionsAPI()]
})

app.use(router)
app.use(vueCompositionApi)

app.mount('#app')
