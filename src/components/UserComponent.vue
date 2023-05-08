<template>
    <!-- HTML -->

    <div >
        <slot name="userrr" :user="firebaseUser"></slot>
    </div>

    <!-- HTML -->
</template>

<script>
// JS

import { auth} from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ref } from 'vue'

export default {
    setup() {

            const firebaseUser = ref(null)
            const unsubscribe = onAuthStateChanged(auth, 
                user => firebaseUser.value = user
            )

            return {
                firebaseUser,
                unsubscribe
            }
        

    },
    
    unmounted() {
        this.unsubscribe()
    }

   
}

// JS
</script>