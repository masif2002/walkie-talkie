<template>
    <h1>Home Page</h1>
    <UserComponent>
        <!-- this template is passed as a child to UserComponent -->
        <template #userrr="{ user }">
            
            <UserProfile v-if="user" :user="user" />
            <LoginComponent v-else />

        </template>

    </UserComponent> 
</template>

<script>
// JS
import LoginComponent from './LoginComponent.vue';
import UserComponent from './UserComponent.vue';
import UserProfile from './UserProfile.vue';

export default {
    components: {
        LoginComponent,
        UserComponent,
        UserProfile
    }
}

// JS
</script>