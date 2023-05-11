<template>
    <div>
        <h3>{{  title }}</h3>
        <ul>
            <li v-for="room of chatRooms" :key="room.id">
                <router-link :to="{name: 'chat', params: {id: room.id}}">{{ room.id }}</router-link>                
            </li>
        </ul>
        <slot name="create-room"></slot>
    </div>
</template>

<script>
export default {
    props: ['title', 'chatRooms']
}
</script>