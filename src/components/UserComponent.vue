<template>
    <!-- HTML -->

    <div >
        <slot nam="user" :user="user"></slot>
    </div>

    <!-- HTML -->
</template>

<script>
// JS

import { auth} from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ref } from '@vue/composition-api'
import { onMounted, onUnmounted } from 'vue'

export default {
    setup() {

        onMounted(() => {
            const user = ref(null)
            const unsubscribe = onAuthStateChanged(auth, 
                firebaseUser => user.value.vaue = firebaseUser
            )

            return {
                user,
                unsubscribe
            }
        })
        

        onUnmounted(() => {
            this.unsubscribe()
        })
    }


   
}

// JS
</script>