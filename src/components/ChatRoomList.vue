<template>
    <div class="w-full room-list">

        <div class="is-flex is-justify-content-space-between is-align-items-center w-full header">
            <h3 class="has-text-white-ter is-uppercase">{{  title }}</h3>
            <slot name="create-room"></slot>
        </div>

        <div class="has-background-black-bis p-5">
            <p v-for="room of chatRooms" :key="room.id">
                <router-link :to="{name: 'chat', params: {id: room.id}}" class="has-text-grey-light :hover has-text-primary" id="link">
                    <span class="icon">
                        <i class="fa fa-telegram"></i>
                    </span>
                    <span>
                        {{ room.id }}
                    </span>
                </router-link>                
            </p>
        </div>

    </div>
</template>

<script>
export default {
    props: ['title', 'chatRooms']
}
</script>

<style scoped>

span {
    margin-right: 3px;
}

.header {
    margin-bottom: 20px;
}

.content h3 {
    margin-bottom: 0;
}
</style>