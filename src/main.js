import { createApp } from 'vue'
import App from './App.vue'

import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire'




const app = createApp(App)

app.use(VueFire, {
    modules: [VueFireFirestoreOptionsAPI()]
})

app.mount('#app')
