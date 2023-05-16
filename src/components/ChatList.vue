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

<style scoped>
section {
    min-height: 80vh;
    margin-top: 80px;
}

.rooms {
    gap: 40px
}
</style>