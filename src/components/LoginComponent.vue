<template>
<!-- HTML -->
<aside>
    <button @click="signInAnonymously(auth)">Login</button>

</aside>
<!-- HTML -->
</template>

<script>
// JS
import { auth } from '../firebase'
import { signInAnonymously } from '@firebase/auth';

export default {
    data() {
        return { auth, signInAnonymously }
    }
}
// JS
</script>