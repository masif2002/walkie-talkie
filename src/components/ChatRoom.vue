<template>
    
    <section class="container">

        <div class="has-text-white is-flex w-full is-justify-content-center">
            
            <h4 class="is-uppercase has-text-white roomid">Room Id: </h4>
            <h4 ref="roomid" class="has-text-primary">{{ chatId }}</h4>
    
            <span class="icon is-clickable has-text-grey-light ml-1"  @click="copyRoomId()">
                <i class="fa fa-copy"></i>
            </span>
    
        </div>
    
        <!-- Read All Messages -->
        <ul ref="container" class="has-background-black-bis">
            <div class="is-flex is-justify-content-center">
                <span class="icon is-clickable chevron" @click="loadMore()" v-if="!noMoreMessages">
                    <i class="fa fa-2x fa-chevron-up"></i>
                </span>
            </div>
            
            <li v-for="message of messages" :key="message.id">
                <ChatMessage :message="message" :owner="message.sender === user?.email"/>
            </li>
        </ul>
        
        <!-- Send Text Message -->
        <div class="field has-addons">
            <div class="control w-full ">
                <input class="p-5 input has-text-primary is-primary is-inverted" type="text" v-model="message" placeholder="Enter message ..." />
            </div>
            <div class="control">
                <button 
                    class="button is-primary p-5"
                    @click="addMessage(user?.email)"
                    :disabled = "(!message && !newAudio) || loading"
                    :class = "{ 'is-loading' : loading }"
                >
                    <span class="icon is-medium">
                        <i class="fa fa fa-paper-plane"></i>
                    </span>
                </button>
            </div>
        </div>
        
        <!-- OR -->
        <div class="choice">
            <p class="has-text-white seperator">OR</p>
            <p class="has-text-grey line">________________________________________________________________________________________</p>
        </div>
        
        <!-- Send Audio Message-->
        <div class="field has-addons is-flex is-justify-content-center mt-5">

            <div class="control">

                <div v-if="newAudio" class="audio-bg audio-height">
                    <audio :src="newAudioURL" controls></audio>
                </div>

                <input v-else type="text" :value="inputMsg" class="input p-5 has-text-grey-lighter is-primary w-400 audio-height" readonly>
            </div>

            <div class="control">
                <button 
                    class="button is-primary p-5  audio-height"  
                    @click="handleVoice()"
                    :class = "{ 'is-loading' : loading, 'circle': newAudio}"
                >
                    
                    <span class="icon" v-if="!recorder">
                        <i v-if="!newAudio" class="fa fa-microphone"></i>
                        <i v-else class="fa fa-paper-plane"></i>
                    </span>
                
                    <span class="icon" v-else>
                        <i class="fa fa-stop"></i>
                    </span>

                </button>
            </div>

        </div>

        <p v-if="newAudio" class="is-flex is-justify-content-center w-full has-text-grey-light is-clickable"
            @click="record()"
        >
            Record Again 
            <span class="icon has-text-primary">
                <i class="fa fa-undo"></i>
            </span>
        </p>
 
    </section>
    
</template>

<script>
import ChatMessage from './ChatMessage.vue'

import { db, storage } from '../firebase'
import { collection, doc, setDoc, query, orderBy, limitToLast, getCountFromServer } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage'
import { useUser } from '../user'


export default {
    components: { ChatMessage },
    data () {
        const fbUser = useUser()
        return {
            user: fbUser.user,
            message: '',
            loading: false,
            messages: [], // for realtime data fetching
            newAudio: null,
            recorder: null,
            numberOfMessages: 10,
            totalMessages: 0,
            inputMsg: 'Send a voice message ...'
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
        messages: {
            handler() {
                // Wait for the DOM to update the message, and then scroll to last message
                this.$nextTick(() => {
                    this.displayLastMessage()
                });
            },
            deep: true
        }
    },
    mounted() {
        // Total Number of messages 
        this.getTotalMessages()
        
        // Fetch actual messages
        this.fetchMessages(this.chatId)
            .then(() => this.displayLastMessage())
    },
    unmounted() {
        this.fbUser?.unsubscribe()
    },
    methods: {
        // Fetch Messages
        async fetchMessages(chatId) {
            const collectionRef =  collection(db, 'chats', chatId, 'messages')

            // Realtime data stream using VueFire
            return this.$firestoreBind('messages', query(collectionRef, orderBy('createdAt'), limitToLast(this.numberOfMessages)))
        },

        // Send Message
        async addMessage(email) 
        {
            // If logged in as anonymous user
            if(!email) {
                this.$toast.error('Must be a registered user to send messages')
                return 
            }

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
            this.inputMsg = 'Send a voice message ...'
        },

        // Start Recording audio
        async record () {
            this.newAudio = null
            this.inputMsg = 'Recording ...'


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

        handleVoice() {
            // Stop Recording icon 
            if (this.recorder) {
                this.stop()
            } 
            // Send message icon
            else if (!this.recorder && this.newAudio) {
                this.addMessage(this.user?.email)
            
            } 
            // Microphone icon
            else if (!this.recorder && !this.newAudio) {
                this.record()
            }


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
  border-radius: 0;
  height: 500px;
  overflow-y: scroll;
}

li {
  display: flex;
}

.chevron {
    color: hsl(0, 0%, 71%)
}
.chevron:hover {
    color: hsl(171, 100%, 41%)
}
.smooth-scroll {
    scroll-behavior: smooth;
}

.container {
    margin: 50px auto 100px auto
}

.roomid {
    margin-right: 8px;
}

.content ul:not(:last-child) {
    margin-bottom: 0;
}

.input {
    background-color: black;
}

::-webkit-input-placeholder {
    color: hsl(0, 0%, 51%);
}

.choice {
    height: 80px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.line {
    margin-top: -69px;
    position: relative;
    z-index: 10;
}

.seperator {
    background-color: black;
    position: relative;
    z-index: 20;
    padding: 20px;
}

.w-400 {
    width: 400px
}

audio::-webkit-media-controls-panel {
    background-color: hsl(0, 0%, 7%)
}

audio::-webkit-media-controls-play-button {
    color: hsl(171, 100%, 41%) !important

}

.audio-bg {
    width: 306px;
    border-radius: 50px;
    background-color: hsl(171, 100%, 41%);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
}

.audio-height {
    height: 60px;
}

.circle {
    border-radius: 50% !important;
}

</style>