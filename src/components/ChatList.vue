<template>
    <h2>Chat Rooms</h2>
    <hr>

    <div v-if="publicChatRoom">
        <h3>Public ChatRooms</h3>
        <ul>
            <li v-for="room of publicChatRoom" :key="room?.id">
                <router-link :to="{name: 'chat', params: {id: room.id}}">{{ room.id }}</router-link>
            </li>
        </ul>
    </div>


    <div v-if="chats">
        <h3>Private ChatRooms</h3>
        <ul>
            <li v-for="chat of chats" :key="chat.id">
                <router-link :to="{name: 'chat', params: {id: chat.id}}">{{ chat.id }}</router-link>
            </li>
        </ul>
    </div>

    <button class="button" @click="createRoom()">Create Room</button>
</template>


<script>
import { db } from '../firebase'
import { addDoc, collection, query, where } from 'firebase/firestore'

export default {
    props: ['userId'],
    data () {return {
        chats: [],
        publicChatRoom: []
    }},
    // Realtime Data fetching using VueFire
    watch: {
        // Waits until UserId is received from the parent component
        userId: {
            immediate: true,
            handler(userId) {
                this.$firestoreBind('chats', query(collection(db, 'chats'), where('owner', '==', userId)))
            }
        }
    },
    // Realtime data fetching iwht vueFire but without any dependency (like userId for 'chats')
    firestore: {
        publicChatRoom: collection(db, 'chats')
    },
    methods: {
        async createRoom() {
            const newRoom = await addDoc(collection(db, 'chats'), {
                createdAt: Date.now(),
                owner: this.userId,
                members: [this.userId],
                public: false
            })

            console.log(newRoom);
        }
    }
}

</script>