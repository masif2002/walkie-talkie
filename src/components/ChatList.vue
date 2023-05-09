<template>
    <h3>Chat Rooms</h3>

    <ul>
        <li v-for="chat of chats" :key="chat.id">
            {{ chat.id }}
        </li>
    </ul>

    <button class="button" @click="createRoom()">Create Room</button>
</template>


<script>
import { db } from '../firebase'
import { addDoc, collection, query, where } from 'firebase/firestore'

export default {
    props: ['userId'],
    data () {return {
        chats: []
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
    // getDocs(query(collection(db, 'chats'), where('owner', '==', userId)))
    methods: {
        async createRoom() {
            const newRoom = await addDoc(collection(db, 'chats'), {
                createdAt: Date.now(),
                owner: this.userId,
                members: [this.userId]
            })

            console.log(newRoom);
        }
    }
}

</script>