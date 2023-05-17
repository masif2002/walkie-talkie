<template>

    <section class="is-flex is-flex-direction-column is-align-items-start px-6 mx-6 mb-6">
        <JoinRoom />

        <div class="rooms is-flex is-flex-direction-column w-full">
            <ChatRoomList v-if="publicChatRooms" :title="'Public chat rooms'" :chatRooms="publicChatRooms"/>
        
            <ChatRoomList v-if="chats" :title="`Your chat rooms`" :chatRooms="chats">
        
                <template #create-room>
                    <button class="button is-primary is-outlined" @click="createRoom()">
                        <span class="icon">
                            <i class="fa fa-plus"></i>
                        </span>
                        <span>
                            Create Room
                        </span>
                    </button>
                </template>
        
            </ChatRoomList>
        </div>
    </section>


</template>


<script>
import { db } from '../firebase'
import { addDoc, collection, query, where } from 'firebase/firestore'
import ChatRoomList from './ChatRoomList.vue'
import JoinRoom from './JoinRoom.vue'

export default {
    props: ['user'],
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
        // Waits until user is received from the parent component
        user: {
            immediate: true,
            handler(user) {
                this.$firestoreBind('chats', query(collection(db, 'chats'), where('owner', '==', user?.uid)))
            }
        }
    },
    // Realtime data fetching with vueFire but without any dependency (like user for 'chats')
    firestore: {
        publicChatRooms: query(collection(db, 'chats'), where('public', '==', true))
    },
    methods: {
        async createRoom() {
            if (!this.user?.email) {
                return this.$toast.error('Must be a registered user to create rooms')
            }
            await addDoc(collection(db, 'chats'), {
                createdAt: Date.now(),
                owner: this.user?.uid,
                members: [this.user?.uid],
                public: false
            })

        }
    }
}

</script>

<style scoped>
section {
    min-height: 80vh;
    margin-top: 80px;
}

.rooms {
    gap: 40px
}
</style>