<template>
    <div class="message" :class="{'from-user': owner}">
        {{ message.text }}
        <br />

        <audio v-if="message.audioURL" :src="message.audioURL" controls></audio>
    
        <span class="sender" v-if="!owner">from <span class="has-text-white-bis">{{ userName }}</span></span>
        <span class="sender has-text-white-ter" v-else>You</span>
    </div>
</template>

<script>
    export default {
        props: ['message', 'owner'],
        computed: {
            userName () {
                const email = this.message?.sender
                return email?.slice(0,email.indexOf('@'))
            }
        }
    }
</script>

<style>
.message {
    background: black;
    color: hsl(171, 100%, 41%);
    margin-left: 10px;
    margin-right: auto;
    border-radius: 5px;
    padding: 12px;
    display: inline-block;
}
.from-user {
  margin-right: 10px;
  margin-left: auto;
  background: hsl(171, 100%, 41%);
  color: black;
}

.sender {
  font-size: 0.6rem;
  margin-left: auto;
  margin-right: 1px;
}

</style>