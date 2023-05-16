<template>
    <div class="is-flex is-justify-content-center w-full mb-6">
        
        <div class="field has-addons">
            <div class="control">
                <input type="text" class="input is-active is-primary has-background-black-ter has-text-white
                " placeholder="Enter Room ID" v-model="roomid">
            </div>
            <div class="control">
                <button class="button is-primary" @click="joinRoom()">
                    Join Room
                </button>
            </div>
        </div>

    </div>
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

<style scoped>
::-webkit-input-placeholder {
    color: hsl(0, 0%, 51%);
}



</style>