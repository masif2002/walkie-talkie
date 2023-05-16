<template>
    <!-- HTML -->

    <div >
        <slot name="userrr" :user="user"></slot>
    </div>

    <!-- HTML -->
</template>

<script>
// JS
import { useUser } from '../user'

export default {
    data() {

            const fbUser = useUser()

            return {
                user: fbUser.user,
            }
        

    },
    
    unmounted() {
        this.fbUser?.unsubscribe()
    }

   
}

// JS
</script>