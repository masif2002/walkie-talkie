<template>
    <p>Welcome to chat room <strong>{{ chatId }}</strong></p>
    <p>Use this link to join the ChatRoom: <pre>{{ chatRoomURL }}</pre></p>

    <UserComponent >
        <template #userrr="{ user }">

            <ul ref="container">
                <button class="button" @click="loadMore()">Load more messages...</button>
                <li v-for="message of messages" :key="message.id">
                    <ChatMessage :message="message" :owner="message.sender === user?.uid"/>
                </li>
            </ul>

            <input type="text" v-model="message" />
            <button 
                class="button is-success"
                @click="addMessage(user?.uid)"
                :disabled = "(!message && !newAudio) || loading"
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
import { db, storage } from '../firebase'
import { collection, doc, setDoc, query, orderBy, limitToLast } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage'
// import { ref } from 'firebase/storage'

export default {
    components: { UserComponent, ChatMessage },
    data () {
        return {
            message: '',
            loading: false,
            messages: [], // for realtime data fetching
            newAudio: null,
            recorder: null,
            numberOfMessages: 10,
        }
    },
    computed: {
        chatRoomURL() {
            return document.URL
        },
        chatId() {
            return this.$route.params.id
        },
        newAudioURL() {
            // Creates a new URL for blob file 
            return URL.createObjectURL(this.newAudio)
        }
    },
    watch: {
        numberOfMessages: {
            handler() {
                this.fetchMessages(this.chatId)
            },
        },
    },
    mounted() {
        this.fetchMessages(this.chatId)
            .then(() => this.displayLastMessage())
    },
    methods: {
        // Fetch Messages
        async fetchMessages(chatId) {
            const collectionRef =  collection(db, 'chats', chatId, 'messages')
            // Realtime data stream using VueFire
            return this.$firestoreBind('messages', query(collectionRef, orderBy('createdAt'), limitToLast(this.numberOfMessages)))
        },

        // Send Message
        async addMessage(userId) 
        {
            this.loading = true

            const collectionRef = collection(db, 'chats', this.chatId, 'messages')
            const messageRef = doc(collectionRef) // Creates a doc in the collection
            const messageId = messageRef.id
            
            // For audio message in Firebase Storage
            let audioURL = null
            
            if (this.newAudio) {
                const storageRef = ref(storage, `chats/${this.chatId}/${messageId}.wav`)

                await uploadBytes(storageRef, this.newAudio).then(() => {
                    console.log('File Uploaded');
                })

                audioURL = await getDownloadURL(storageRef)
            }

            // For Message in Firestore
            await setDoc(messageRef, {
                text: this.message,
                sender: userId,
                createdAt: Date.now(),
                audioURL,
            })

            this.displayLastMessage()

            this.loading = false
            this.message = ''
            this.newAudio = null
        },

        // Start Recording audio
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

        // Stop Recording audio
        async stop() {
            this.recorder.stop()
            this.recorder = null
        },

        // Load more messages
        loadMore() {
            this.numberOfMessages += 10
        },

        displayLastMessage () {
            const msgContainer = this.$refs.container
            msgContainer.scrollTo(0, msgContainer.scrollHeight)
        }

    }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  min-width: 500px;
  background: #efefef;
  border-radius: 0;
  height: 500px;
  overflow-y: scroll;
  scroll-behavior: smooth;
}

li {
  display: flex;
}
</style>