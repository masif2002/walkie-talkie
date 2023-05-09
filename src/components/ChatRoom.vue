<template>
    <p>Welcome to chat room <strong>{{ chatId }}</strong></p>

    <UserComponent >
        <template #userrr="{ user }">

            <ul>
                <li v-for="message of messages" :key="message.id">
                    {{  message.text }}
                </li>
            </ul>

            <input type="text" v-model="message" />
            <button 
                class="button is-success"
                @click="addMessage(user.uid)"
            >
                Send Message
            </button>

        </template>
    </UserComponent>
</template>

<script>
import UserComponent from './UserComponent.vue'
import { db } from '../firebase'
import { collection, addDoc, query, orderBy } from 'firebase/firestore'

export default {
    components: {UserComponent},
    data () {
        return {
            message: '',
            loading: false,
            messages: [] // for realtime data fetching
        }
    },
    computed: {
        chatId() {
            return this.$route.params.id
        },
    },
    // Realtime Data fetching using VueFire
    watch: {
        chatId: {
            immediate: true,
            handler(chatId) {
                const collectionRef =  collection(db, 'chats', chatId, 'messages')
                this.$firestoreBind('messages', query(collectionRef, orderBy('createdAt')))
            }
        }
    },
    // firebase: {
    //     messages: collection(db, 'chats', this.chatId, 'messages')
    // },
    methods: {
        async addMessage(userId) 
        {
            this.loading = true

            const ref = collection(db, 'chats', this.chatId, 'messages')
            await addDoc(ref, {
                text: this.message,
                sender: userId,
                createdAt: Date.now()
            })

            this.loading = false
        }
    }
}
</script>