<template>
    <label for="roomid">Enter chat room code to join</label>
    <input type="text" id="roomid" v-model="roomid">

    <button
        class="button is-info"
        @click="joinRoom()"
    >
        Join
    </button>

</template>

<script>
export default {
    data () {
        return {
            roomid: '',
            errorMsg: '',
        }
    },
    methods: {
        joinRoom() {
            if (!this.roomid) {
                this.$toast.error('Please enter valid Room ID')
            } else {
                this.$router.push({ name: 'chat', params: {id: this.roomid}})
            }
        }
    }
}
</script>