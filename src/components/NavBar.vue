<template>
    <nav class="is-flex is-justify-content-space-between is-align-items-center py-2 px-6">
        <router-link :to="{name: 'home'}">

            <div class="header">
                <img src="../assets/walkie-talkie.png" alt="logo" height="50" width="50">
                <h1 class="has-text-white">WalkieTalkie</h1>
            </div>

        </router-link>
        
        <div class="is-flex is-align-items-center" v-if="user">
            <p class="has-text-white">Logged in as 
                <span class="has-text-primary">{{ user?.email ?? user?.uid }}</span>
            </p>
            <span class="icon is-medium has-text-white is-clickable" @click="signOutUser()">
                <i class="fa fa-lg fa-sign-out"></i>
            </span>
        </div>
    </nav>
</template>

<script>
import { signOutUser } from '../utils';
import { useUser } from '../user';

export default {
    data() {
        const fbUser = useUser()

        return {
            user: fbUser.user,
            signOutUser
        }
    },
    unmounted() {
        this.fbUser?.unsubscribe()
    }
}
</script>

<style scoped>
p:hover {
    opacity: 70%;
}

.header {
    display: flex;
    align-items: center;
}

.header img {
    transform: rotateZ(45deg);
    margin-right: -2px;
    margin-bottom: -6px;
}

.content p:not(:last-child) {
    margin-bottom: 0;
    margin-right: 25px;
}

.icon:hover {
    opacity: 60%;
}

</style>