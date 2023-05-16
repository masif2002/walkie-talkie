<template>
    <section class="is-flex is-align-items-center is-justify-content-center" id="home">
        <UserComponent>
            <!-- this template is passed as a child to UserComponent -->
            <template #userrr="{ user }">
                
                <LoginComponent v-if="!user" />
    
                <ChatList :userId="user.uid" v-if="user"/>
    
            </template>
    
        </UserComponent> 
    </section>
</template>

<script>
// JS
import LoginComponent from './LoginComponent.vue';
import UserComponent from './UserComponent.vue';
import ChatList from './ChatList.vue';

export default {
    components: {
        LoginComponent,
        UserComponent,
        ChatList
    }
}

// JS
</script>

<style scoped>
#home {
    height: 80vh;
}

</style>