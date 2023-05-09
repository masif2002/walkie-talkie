<template>
    <div>
        Logged in as {{ user.uid }}
    </div>
    <button @click="signOut(auth)" class="button is-info">Logout</button>
</template>

<script>
import { signOut } from 'firebase/auth'
import { auth } from  '../firebase'

export default {
    data () {
        return {
            signOut,
            auth
        }
    },
    props: ['user']
}
</script>