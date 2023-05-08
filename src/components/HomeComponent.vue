<template>
    <h1>Home Page</h1>
    <UserComponent>
        <!-- this template is passed as a child to UserComponent -->
        <template #userrr="{ user }">
            
            <div  v-if="user">
                Logged in as {{ user.isAnonymous }}
            </div>
            <LoginComponent v-else />

        </template>

    </UserComponent> 
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