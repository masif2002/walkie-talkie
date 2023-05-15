<template>
    <p>Welcome to chat room. Room code to join: </p>
    
    <div class="flex">
        <pre ref="roomid">{{ chatId }}</pre>
    
        <button class="button" @click="copyRoomId()">
            Copy RoomId
        </button>
    </div>

    <UserComponent >
        <template #userrr="{ user }">

            <ul ref="container">
                <button class="button" @click="loadMore()" v-if="!noMoreMessages">Load more messages...</button>
                <li v-for="message of messages" :key="message.id">
                    <ChatMessage :message="message" :owner="message.sender === user?.email"/>
                </li>
            </ul>

            <input type="text" v-model="message" />
            <button 
                class="button is-success"
                @click="addMessage(user?.email)"
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
import { collection, doc, setDoc, query, orderBy, limitToLast, getCountFromServer } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage'


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
            totalMessages: 0,
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
        },
        noMoreMessages() {
            return this.numberOfMessages >= this.totalMessages
        },
    },
    watch: {
        numberOfMessages: {
            handler() {
                // Logic for fixing scroll when retrieving old messages
                const msgContainer = this.$refs.container
                const initialHeight = msgContainer.scrollHeight

                this.fetchMessages(this.chatId)
                    .then(() => msgContainer.scrollTop = msgContainer.scrollHeight - initialHeight)
            },
        },
    },
    mounted() {
        this.getTotalMessages()

        this.fetchMessages(this.chatId)
            .then(() => this.displayLastMessage())
    },
    methods: {
        // Fetch Messages
        async fetchMessages(chatId) {9999
            const collectionRef =  collection(db, 'chats', chatId, 'messages')

            // Realtime data stream using VueFire
            return this.$firestoreBind('messages', query(collectionRef, orderBy('createdAt'), limitToLast(this.numberOfMessages)))
        },

        // Send Message
        async addMessage(email) 
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
                sender: email,
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
            
            this.getTotalMessages()
        },

        async getTotalMessages() {
            const collectionRef =  collection(db, 'chats', this.chatId, 'messages')
            const snapshot = await getCountFromServer(collectionRef)
            this.totalMessages = snapshot.data().count
        },

        displayLastMessage () {
            const msgContainer = this.$refs.container

            msgContainer.classList.add('smooth-scroll')

            msgContainer.scrollTo(0, msgContainer.scrollHeight)

            msgContainer.classList.remove('smooth-scroll')
        },

        copyRoomId() {
            const roomId = this.$refs.roomid.textContent
            navigator.clipboard.writeText(roomId)

            this.$toast.success("RoomID copied to clipboard")
        },

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
}

li {
  display: flex;
}

pre {
    width: 400px;
    padding: 20px;
}

.smooth-scroll {
    scroll-behavior: smooth;
}

.flex {
    display: flex;
}
</style>