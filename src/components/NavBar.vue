<template>
    <nav class="is-flex is-justify-content-space-between is-align-items-center py-2 px-6">
        <router-link :to="{name: 'home'}">

            <div class="header">
                <img src="../assets/walkie-talkie.png" alt="logo" height="50" width="50">
                <h1 class="has-text-white">WalkieTalkie</h1>
            </div>

        </router-link>
        <p class="has-text-white is-clickable">Login</p>
    </nav>
</template>

<script>
export default {

}
</script>

<style scoped>
p:hover {
    opacity: 70%;
}

.header {
    display: flex;
    align-items: center;
}

.header img {
    transform: rotateZ(45deg);
    margin-right: -2px;
    margin-bottom: -6px;
}
</style>