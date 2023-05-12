<template>
    <h2>Chat Rooms</h2>
    <hr>

    <JoinRoom />

    <ChatRoomList v-if="publicChatRooms" :title="'Public Chat Rooms'" :chatRooms="publicChatRooms"/>

    <ChatRoomList v-if="chats" :title="`${userId}'s chat rooms`" :chatRooms="chats">

        <template #create-room>
            <button class="button" @click="createRoom()">Create Room</button>
        </template>

    </ChatRoomList>


</template>


<script>
import { db } from '../firebase'
import { addDoc, collection, query, where } from 'firebase/firestore'
import ChatRoomList from './ChatRoomList.vue'
import JoinRoom from './JoinRoom.vue'

export default {
    props: ['userId'],
    components: {
        ChatRoomList,
        JoinRoom
    },
    data () {return {
        chats: [],
        publicChatRooms: []
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
    // Realtime data fetching with vueFire but without any dependency (like userId for 'chats')
    firestore: {
        publicChatRooms: query(collection(db, 'chats'), where('public', '==', true))
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