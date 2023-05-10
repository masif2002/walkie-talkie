<template>
    <p>Welcome to chat room <strong>{{ chatId }}</strong></p>

    <UserComponent >
        <template #userrr="{ user }">

            <ul>
                <li v-for="message of messages" :key="message.id">
                    <ChatMessage :message="message" :owner="message.sender === user.uid"/>
                </li>
            </ul>

            <input type="text" v-model="message" />
            <button 
                class="button is-success"
                @click="addMessage(user.uid)"
                :disabled = "!message || loading"
                :class = "{ 'is-loading' : loading }"
            >
                Send Message
            </button>

            <h5>Record Audio</h5>

            <button v-if="!recorder" @click="record()" class="button is-info">Record Voice</button>
            <button v-else @click="stop()" class="button is-danger">Stop</button>

            <br />

            <audio v-if="newAudio" :src="newAudioURL" controls></audio>

            <hr />

        </template>
    </UserComponent>
</template>

<script>
import UserComponent from './UserComponent.vue'
import ChatMessage from './ChatMessage.vue'
import { db } from '../firebase'
import { collection, addDoc, query, orderBy, limitToLast } from 'firebase/firestore'

export default {
    components: { UserComponent, ChatMessage },
    data () {
        return {
            message: '',
            loading: false,
            messages: [], // for realtime data fetching
            newAudio: null,
            recorder: null,
        }
    },
    computed: {
        chatId() {
            return this.$route.params.id
        },
        newAudioURL() {
            // Creates a new URL for blob file 
            return URL.createObjectURL(this.newAudio)
        }
    },
    // Realtime Data fetching using VueFire
    watch: {
        chatId: {
            immediate: true,
            handler(chatId) {
                const collectionRef =  collection(db, 'chats', chatId, 'messages')
                this.$firestoreBind('messages', query(collectionRef, orderBy('createdAt'), limitToLast(10)))
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
            this.message = ''
        },

        async record () {
            this.newAudio = null

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })

            const options = { mimeType: "audio/webm" }
            const recordedChunks = []
            this.recorder = new MediaRecorder(stream, options)

            this.recorder.addEventListener('dataavailable', e => {
                
                if (e.data.size > 0) {
                    recordedChunks.push(e.data)
                }
            })

            this.recorder.addEventListener('stop', () => {
                this.newAudio = new Blob(recordedChunks);
                console.log(this.newAudio);
            })

            this.recorder.start()
        },

        async stop() {
            this.recorder.stop()
            this.recorder = null
        }
    }
}
</script>

<style>
ul {
  list-style-type: none;
  margin: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  min-width: 500px;
  background: #efefef;
  border-radius: 0;
}

li {
  display: flex;
}
</style>