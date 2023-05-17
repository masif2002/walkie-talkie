<template>
    <section>
        <UserComponent>
            <!-- this template is passed as a child to UserComponent -->
            <template #userrr="{ user }">
                
                <ChatList :user="user" v-if="user"/>
    
            </template>
    
        </UserComponent> 
    </section>
</template>

<script>
// JS
import UserComponent from './UserComponent.vue';
import ChatList from './ChatList.vue';

export default {
    components: {
        UserComponent,
        ChatList
    }
}

// JS
</script>
