<template>
    <h1>Home Page</h1>
    <UserComponent v-if="user" />
    <LoginComponent v-else />
</template>

<script>
// JS
/* eslint-disable */
import LoginComponent from './LoginComponent.vue';
import UserComponent from './UserComponent.vue';

export default {
    components: {
        LoginComponent,
        UserComponent
    }
}

// JS
</script>